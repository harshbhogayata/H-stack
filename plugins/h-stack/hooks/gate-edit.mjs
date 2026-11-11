#!/usr/bin/env node
// PreToolUse(Edit|Write|MultiEdit|NotebookEdit). FAILURE_MODE=closed (onFailure: block).
// HS-028a read-only tests, HS-029 protected paths and state, HS-031 manifest/import dependency gate,
// HS-034 .env must be git-ignored, HS-023 subagent scratch isolation. Returns deny or ask only.
import fs from 'node:fs';
import path from 'node:path';
import { runHook, projectDir, sessionDir, readJson, readJsonl, appendLine, loadConfig, refusal, preDecision, relToProject, git } from '../lib/core.mjs';
import { isTestPath } from '../lib/tests.mjs';
import { protectedKind, namedInPrompt } from '../lib/protected.mjs';
import { manifestAdds, importAdds, checkPackages } from '../lib/deps.mjs';
import { testPhaseActive } from '../lib/phase.mjs';
import { logTool } from '../lib/telemetry.mjs';

const READ_ONLY_AGENTS = /(review|audit|rubric|intent|lane|grader|judge|explore)/i;

function proposed(input, abs) {
  const t = input.tool_input || {};
  let before = '';
  try { before = fs.readFileSync(abs, 'utf8'); } catch { /* new file */ }
  if (input.tool_name === 'Write') return { before, after: String(t.content ?? '') };
  if (input.tool_name === 'Edit') return { before, after: before.split(t.old_string ?? '').join(t.new_string ?? ''), oldStr: t.old_string, newStr: t.new_string };
  if (input.tool_name === 'MultiEdit') { let after = before; for (const e of t.edits || []) after = after.split(e.old_string ?? '').join(e.new_string ?? ''); return { before, after, oldStr: (t.edits || []).map((e) => e.old_string).join('\n'), newStr: (t.edits || []).map((e) => e.new_string).join('\n') }; }
  return { before, after: String(t.new_source ?? '') };
}

function miniDiff(oldStr, newStr) {
  const o = String(oldStr ?? '').split('\n').slice(0, 4).map((l) => `- ${l.slice(0, 90)}`);
  const n = String(newStr ?? '').split('\n').slice(0, 4).map((l) => `+ ${l.slice(0, 90)}`);
  return [...o, ...n].join(' | ');
}

export async function decide(input, proj) {
  const sid = input.session_id || 'no-session';
  const dir = sessionDir(proj, sid);
  const config = loadConfig(proj);
  const route = readJson(path.join(dir, 'route.json'), {});
  const p = input.tool_input?.file_path || input.tool_input?.notebook_path;
  if (!p) return null;
  const abs = path.isAbsolute(p) ? p : path.join(proj, p);
  const rel = relToProject(proj, abs);
  const asks = [];
  const denies = [];

  // HS-023 write isolation for review/audit/rubric subagents.
  if (input.agent_id && READ_ONLY_AGENTS.test(input.agent_type || '')) {
    const scratch = path.join('.h-stack', 'sessions');
    if (!rel.startsWith(scratch) || !rel.includes(`/agents/`)) denies.push(refusal('subagent-write-isolation', `${input.agent_type} is a read-only subagent and ${rel} is outside its scratch directory`, `write findings to .h-stack/sessions/<session>/agents/${input.agent_id}/scratch/ or return them in the final message`));
  }

  if (!rel.startsWith('..')) {
    const kind = protectedKind(rel, config);
    if (kind === 'state' && !(input.agent_id && rel.includes(`/agents/${input.agent_id}/scratch/`))) denies.push(refusal('protected-state', `${rel} is H-Stack state written only by hooks and hs`, 'use the hs command instead'));
    else if (kind === 'checker' && !namedInPrompt(rel, route)) asks.push(refusal('protected-checker', `${rel} is a CI, agent or test-runner config`, 'the user approves edits to checkers'));

    const exists = fs.existsSync(abs);
    // Test files Claude created in this session are its own new tests, not existing ones: red-green
    // adds to them slice by slice. Measured: the tdd activation eval regressed (0.50 vs 1.00)
    // because the second slice into a just-created test file was blocked.
    const createdFile = path.join(dir, 'created-tests.jsonl');
    const isTest = isTestPath(rel, proj, config);
    if (isTest && !exists) appendLine(createdFile, { path: rel, ts: Date.now() }, proj);
    const createdHere = isTest && exists && readJsonl(createdFile).some((r) => r.path === rel);
    if (isTest && exists && !createdHere && !testPhaseActive(dir, input.prompt_id || route.prompt_id, proj, config)) {
      const t = input.tool_input || {};
      const diff = input.tool_name === 'Write' ? 'full rewrite of an existing test file' : miniDiff(t.old_string ?? (t.edits || []).map((e) => e.old_string).join('\n'), t.new_string ?? (t.edits || []).map((e) => e.new_string).join('\n'));
      asks.push(refusal('read-only-tests', `editing the existing test file ${rel} outside a declared test-writing step (${diff.slice(0, 400)})`, 'declare the step with hs phase test before implementation edits, or the user approves this diff'));
    }

    // HS-034: .env files must be git-ignored before writing.
    if (/(^|\/)\.env(\.|$)/.test(rel) && !/\.(example|sample|template|dist)$/.test(rel)) {
      const ignored = git(proj, ['check-ignore', '-q', rel]) !== null;
      if (!ignored) asks.push(refusal('env-not-ignored', `${rel} is not git-ignored, so secrets written to it could be committed`, 'add it to .gitignore first'));
    }

    // HS-031: manifest and import dependency gate.
    const { before, after } = proposed(input, abs);
    const pkgs = [...manifestAdds(rel, before, after), ...importAdds(proj, rel, before, after)];
    const uniq = [...new Map(pkgs.map((x) => [`${x.eco}:${x.name}`, x])).values()];
    if (uniq.length) {
      const problems = await checkPackages(proj, uniq, config);
      if (problems.length) asks.push(refusal('dependency-gate', problems.slice(0, 3).map((x) => `${x.eco}:${x.name} ${x.reason}`).join('; '), 'check the package with the user before adding it'));
    }
  }

  for (const d of denies) logTool(proj, { tool: input.tool_name, rule: d.split(':')[0], decision: 'deny' });
  for (const a of asks) logTool(proj, { tool: input.tool_name, rule: a.split(':')[0], decision: 'ask' });
  if (denies.length) return preDecision('deny', denies.join(' '));
  if (asks.length) return preDecision('ask', asks.join(' '));
  return null;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await runHook('gate-edit', 'closed', async (input) => decide(input, projectDir(input)));
}
