#!/usr/bin/env node
// PreToolUse(Bash) gate. FAILURE_MODE=closed (onFailure: block).
// HS-030 irreversible + dry-run receipt + binding, HS-031 dependency gate, HS-029 protected redirects,
// HS-028a test-file redirects, HS-034 credential exec, HS-035 scope lock, HS-032 fetch destination + taint,
// HS-038 step budget, HS-083 install asks, HS-022 pre_push trigger. Returns deny or ask only.
import path from 'node:path';
import { runHook, projectDir, sessionDir, readJson, readJsonl, appendLine, loadConfig, refusal, preDecision, context, git, sha, relToProject, isMain } from '../lib/core.mjs';
import { classifyBash, credentialExec, ghTargetNumbers, isDryRunLike, manifest } from '../lib/irreversible.mjs';
import { installTargets, checkPackages } from '../lib/deps.mjs';
import { parseCommands, exe } from '../lib/shell.mjs';
import { protectedKind, namedInPrompt } from '../lib/protected.mjs';
import { isTestPath } from '../lib/tests.mjs';
import { taintedIn, privateDestination } from '../lib/taint.mjs';
import { logTool } from '../lib/telemetry.mjs';
import { testPhaseActive } from '../lib/phase.mjs';
import { loadIndex } from '../lib/index.mjs';
import { declared } from '../lib/effects.mjs';

const WRITE_CMDS = new Set(['tee', 'cp', 'mv', 'sed', 'perl', 'truncate', 'dd', 'install', 'rm', 'ln', 'chmod']);

function writeTargets(cmds) {
  const out = [];
  for (const c of cmds) {
    for (const r of c.redirects) if (r.op.startsWith('>') && !/^&?\d?$/.test(r.target) && r.target !== '/dev/null') out.push(r.target);
    const e = exe(c);
    if (!WRITE_CMDS.has(e)) continue;
    const args = c.argv.slice(1).filter((x) => !x.startsWith('-'));
    if (e === 'tee') out.push(...args);
    else if ((e === 'cp' || e === 'mv' || e === 'install' || e === 'ln') && args.length >= 2) out.push(args[args.length - 1]);
    else if ((e === 'sed' || e === 'perl') && c.argv.some((x) => /^-[a-zA-Z]*i/.test(x))) out.push(...args.slice(1));
    else if (e === 'truncate' || e === 'rm' || e === 'chmod') out.push(...args.slice(e === 'chmod' ? 1 : 0));
    else if (e === 'dd') { const of = c.argv.find((x) => x.startsWith('of=')); if (of) out.push(of.slice(3)); }
  }
  return out;
}

export async function decide(input, proj) {
  const sid = input.session_id || 'no-session';
  const dir = sessionDir(proj, sid);
  const config = loadConfig(proj);
  const cmd = String(input.tool_input?.command || '');
  const cmds = parseCommands(cmd);
  const route = readJson(path.join(dir, 'route.json'), {});
  const asks = [];
  const denies = [];
  const ctx = [];

  // HS-038 step budget (counts written by the turn.step mod; absent => no budget).
  const steps = readJson(path.join(dir, 'steps.json'), null);
  if (steps && steps.prompt_id && steps.prompt_id === (input.prompt_id || route.prompt_id)) {
    const cap = config.budgets?.steps?.[route.size || 'light'];
    if (cap && steps.count > cap) denies.push(refusal('step-budget', `this turn used ${steps.count} model steps (cap ${cap} for size=${route.size || 'light'})`, 'stop and summarise what is done, what remains and the next step for the user'));
  }

  // HS-030 irreversible actions.
  const defaultBranch = ((git(proj, ['symbolic-ref', '--short', 'refs/remotes/origin/HEAD']) || '').trim().split('/').pop()) || 'main';
  const currentBranch = (git(proj, ['branch', '--show-current']) || '').trim();
  const findings = classifyBash(cmd, { defaultBranch, currentBranch });
  const allow = (config.irreversible?.allowlist || []);
  const cmdSha = sha(cmd, 16);
  for (const f of findings) {
    if (f.high) { denies.push(refusal('exfiltration-guard', `the command sends a secret-looking value to ${f.destination}`, 'remove the secret from the command; secrets never go to the network')); continue; }
    if (allow.some((a) => a === cmdSha || (a.startsWith('re:') && new RegExp(a.slice(3)).test(cmd)))) continue;
    let fact = `irreversible action (${manifest(f)})`;
    if (f.needsDryRun) {
      const rows = readJsonl(path.join(dir, 'ledger.jsonl'));
      let lastEdit = -1; rows.forEach((r, i) => { if (r.kind === 'edit') lastEdit = i; });
      const exeName = (f.argv || [])[0];
      const dry = rows.find((r, i) => r.kind === 'receipt' && i > lastEdit && r.exit === 0 && isDryRunLike(r.cmd) && (!exeName || r.cmd.includes(exeName.split('/').pop())));
      fact += dry ? `; dry-run receipt ${dry.id} (\`${dry.cmd.slice(0, 50)}\`)` : `; no fresh read-only receipt for this target (try ${(f.dry || []).slice(0, 2).join(' or ')})`;
    }
    asks.push(refusal('irreversible-gate', fact, 'the user approves this exact command; a changed command asks again'));
    appendLine(path.join(dir, 'approvals.jsonl'), { cmd_sha: cmdSha, manifest: manifest(f), ts: Date.now() }, proj);
  }

  // HS-044 declared effects: while a manifest is armed, irreversible actions and writes must be declared.
  const manifestFile = path.join(proj, '.h-stack', 'active-manifest.json');
  const manifestObj = readJson(manifestFile, null);
  if (manifestObj && Array.isArray(manifestObj.effects)) {
    const undeclared = [];
    for (const f of findings) {
      const kind = /push/.test(f.cls) ? 'push' : f.cls === 'send' ? 'send' : 'bash';
      const target = kind === 'bash' ? cmd.trim() : `${f.target} ${f.destination}`;
      if (!declared(manifestObj, { kind, target })) undeclared.push(f.target);
    }
    for (const t of writeTargets(cmds)) { const rel = relToProject(proj, t); if (!declared(manifestObj, { kind: 'edit', target: rel })) undeclared.push(`write ${rel}`); }
    if (undeclared.length) denies.push(refusal('declared-effects', `${undeclared.slice(0, 3).join(', ')} is not declared in ${manifestObj.source || 'the active task manifest'}`, 'add it to the manifest\'s effects with the user'));
  }

  // HS-035 scope lock.
  const nums = ghTargetNumbers(cmd);
  const scope = route.scope_numbers || [];
  for (const n of nums) if (scope.length && !scope.includes(n)) asks.push(refusal('scope-lock', `this writes to #${n}, but the request named ${scope.map((s) => '#' + s).join(', ')}`, 'confirm the target number with the user'));

  // HS-034 credential commands through project-controlled executables.
  for (const c of credentialExec(cmd)) asks.push(refusal('trusted-executable', `\`${c}\` runs a credential-bearing step through a project-controlled executable`, 'run the globally installed tool, or the user confirms this one'));

  // HS-031 dependency gate + HS-083 install asks.
  const pkgs = installTargets(cmd);
  if (pkgs.length) {
    const problems = await checkPackages(proj, pkgs, config);
    if (problems.length) asks.push(refusal('dependency-gate', problems.slice(0, 3).map((p) => `${p.eco}:${p.name} ${p.reason}`).join('; '), 'check the package name and source with the user'));
  }
  for (const c of cmds) {
    const a = c.argv.join(' ');
    if (/^(npx|bunx|pnpm dlx) (-y )?(skills|@[\w-]+\/skills)\b.*\badd\b/.test(a) || /^claude (plugin|plugins) (install|marketplace add)\b/.test(a) || /^claude mcp add\b/.test(a)) {
      asks.push(refusal('supply-chain', `\`${a.slice(0, 60)}\` installs third-party instructions or tools`, 'the user reviews the source first; H-Stack never installs skills on its own'));
    }
  }

  // Self-audit F4/F5: H-Stack state is written only by hooks and hs. Any other command that names a
  // .h-stack/ path (mv source, node -e, find -delete, ...) is denied unless it only reads.
  const READERS = new Set(['cat', 'head', 'tail', 'less', 'more', 'ls', 'grep', 'rg', 'jq', 'wc', 'stat', 'diff', 'file', 'du', 'tree', 'bat']);
  for (const c of cmds) {
    const e = exe(c);
    if (e === 'hs') {
      if (c.argv[1] === 'manifest' && c.argv[2] === 'stop') asks.push(refusal('declared-effects', 'hs manifest stop lifts the task manifest that limits this job\'s effects', 'the user approves ending the manifest'));
      continue;
    }
    // Redirect targets are checked by the protected-paths block below; this covers arguments.
    const names = c.argv.slice(1).filter((x) => /(^|[\s'"=:(/])\.h-stack(\/|\b)/.test(String(x)));
    if (!names.length) continue;
    const readOnly = READERS.has(e) || (e === 'find' && !c.argv.some((x) => /^-(delete|exec|execdir|ok|fprint)/.test(x)));
    if (readOnly) continue;
    if (names.every((x) => /\.h-stack\/config\.json/.test(x))) asks.push(refusal('protected-checker', `\`${c.argv.join(' ').slice(0, 60)}\` changes .h-stack/config.json, H-Stack's policy file`, 'the user approves policy changes'));
    else denies.push(refusal('protected-state', `\`${c.argv.join(' ').slice(0, 60)}\` touches H-Stack state, which only hooks and hs write`, 'use the hs command instead'));
  }

  // HS-023 / self-audit F11: read-only subagents write only to their scratch directory, Bash included.
  if (input.agent_id && /(review|audit|rubric|intent|lane|grader|judge|explore)/i.test(input.agent_type || '')) {
    for (const t of writeTargets(cmds)) {
      const rel = relToProject(proj, t);
      if (t === '/dev/null' || rel.includes(`/agents/${input.agent_id}/scratch/`) || /^\/tmp\//.test(t)) continue;
      denies.push(refusal('subagent-write-isolation', `${input.agent_type} is a read-only subagent and the command writes ${rel}`, `write to .h-stack/sessions/<session>/agents/${input.agent_id}/scratch/ or return findings in the final message`));
    }
  }

  // HS-029 protected paths and HS-028a test files via shell writes.
  for (const t of writeTargets(cmds)) {
    const rel = relToProject(proj, t);
    if (rel.startsWith('..')) continue;
    const kind = protectedKind(rel, config);
    if (kind === 'state') denies.push(refusal('protected-state', `${rel} is H-Stack state written only by hooks and hs`, `use the hs command instead`));
    else if (kind === 'checker' && !namedInPrompt(rel, route)) asks.push(refusal('protected-checker', `the command writes to ${rel}, a CI, agent or test-runner config`, 'the user approves edits to checkers'));
    else if (isTestPath(rel, proj, config) && !testPhaseActive(dir, input.prompt_id || route.prompt_id, proj, config)) asks.push(refusal('read-only-tests', `the command writes to the test file ${rel} outside a declared test-writing step`, 'declare the step with hs phase test before editing tests, or the user approves'));
  }

  // HS-032 network destinations and taint.
  for (const c of cmds) {
    const e = exe(c);
    if (!['curl', 'wget', 'http', 'xh', 'httpie'].includes(e)) continue;
    // Self-audit F6: curl also takes scheme-less URLs (`curl 169.254.169.254/...`).
    const VALUE = /^(-d|--data.*|-F|--form|-H|--header|-o|--output|-u|--user|-A|--user-agent|-e|--referer|-x|--proxy|-b|--cookie|-c|--cookie-jar|-T|--upload-file|-X|--request|-w|--write-out|-m|--max-time|--connect-timeout|-O|--output-document|--post-data|--post-file|--header)$/;
    const bare = c.argv.slice(1).filter((x, i, a) => !x.startsWith('-') && !(i > 0 && VALUE.test(a[i - 1])));
    const urls = bare.map((x) => (/^https?:\/\//i.test(x) ? x : /^(\[[0-9a-f:.]+\]|[\w.-]+)(:\d+)?(\/|$)/i.test(x) && /[.:\[]|^localhost/i.test(x) ? `http://${x}` : null)).filter(Boolean);
    const priv = urls.map(privateDestination).find(Boolean) || null;
    const tainted = taintedIn(proj, sid, c.argv.join(' '), route.trusted_values || []);
    if (priv && tainted.any) asks.push(refusal('fetch-destination', `${e} targets ${priv} while untrusted content is in play`, 'the user confirms this local or metadata request'));
    const isWrite = c.argv.some((x, i) => ((x === '-X' || x === '--request') && !/^GET$/i.test(c.argv[i + 1] || '')) || /^(-d|--data|-F|--form|-T|--upload-file|--post-(file|data))/.test(x));
    if (isWrite && tainted.hits.length) asks.push(refusal('argument-taint', `the request uses ${tainted.hits.slice(0, 2).join(', ')} seen only in untrusted content`, 'the user confirms the destination'));
  }

  // HS-022 pre_push trigger.
  if (cmds.some((c) => (exe(c) === 'git' && c.argv[1] === 'push') || (exe(c) === 'gh' && c.argv[1] === 'pr' && c.argv[2] === 'create'))) {
    const ev = loadIndex().events?.pre_push;
    if (ev && ev.length) ctx.push(`H-Stack: Relevant skill: ${ev[0]} because a push or PR is about to be created (pre_push).`);
  }

  for (const d of denies) logTool(proj, { tool: 'Bash', rule: d.split(':')[0], decision: 'deny' });
  for (const a of asks) logTool(proj, { tool: 'Bash', rule: a.split(':')[0], decision: 'ask' });
  if (denies.length) return preDecision('deny', denies.join(' '), ctx.join('\n') || undefined);
  if (asks.length) return preDecision('ask', [...new Set(asks)].join(' '), ctx.join('\n') || undefined);
  return ctx.length ? context('PreToolUse', ctx.join('\n')) : null;
}

if (isMain(import.meta.url)) {
  await runHook('gate-bash', 'closed', async (input) => decide(input, projectDir(input)));
}
