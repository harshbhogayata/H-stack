#!/usr/bin/env node
// HS-083 scan third-party skills, hooks and MCP configs before they are enabled.
//   node ${CLAUDE_PLUGIN_ROOT}/scripts/scan-skill.mjs <dir-or-file> [...]
// Flags remote instruction loading, hidden Unicode, injection phrasing, telemetry endpoints,
// install-time hooks, unpinned MCP packages and secret reads. Read-only; prints findings.
import fs from 'node:fs';
import path from 'node:path';
import { scanDescription } from '../lib/pure/firewall.mjs';

const CHECKS = [
  ['remote-instructions', /\b(curl|wget|fetch|axios\.get|requests\.get|http\.get|WebFetch)\b[^\n]{0,80}https?:\/\/[^\s'"]+\.(md|txt|json|ya?ml)\b/i],
  ['remote-instructions', /\b(load|read|fetch|follow)\b[^\n]{0,40}\b(rules|instructions|guidelines|prompt)\b[^\n]{0,40}\bfrom\b[^\n]{0,20}https?:\/\//i],
  ['telemetry', /\b(posthog|segment\.io|mixpanel|amplitude|sentry\.io\/api|google-analytics|telemetry\.(send|track)|track\(['"]|analytics\.(track|identify))\b/i],
  ['install-hook', /"(postinstall|preinstall|install|prepare)"\s*:\s*"/],
  ['unpinned-mcp', /"(command|args)"[^\n]{0,120}(@latest|npx -y [\w@/-]+(?!@\d))/],
  ['secret-read', /(~\/\.ssh|\.aws\/credentials|\.netrc|\.npmrc|printenv|process\.env\)|os\.environ\b(?!\.get\(['"](HOME|PATH)))/],
  ['cookie-request', /\b(paste|send|share|give)\b[^\n]{0,40}\b(cookie|session token|auth token)s?\b/i],
  ['hook-config', /"hooks"\s*:\s*\{/],
];

function files(p) {
  const st = fs.statSync(p);
  if (st.isFile()) return [p];
  return fs.readdirSync(p).flatMap((f) => (f === '.git' || f === 'node_modules' ? [] : files(path.join(p, f))));
}

const targets = process.argv.slice(2);
if (!targets.length) { console.log(JSON.stringify({ status: 'error', reason: 'usage: scan-skill.mjs <dir-or-file> ...' })); process.exit(2); }
const findings = [];
for (const t of targets) for (const f of files(t)) {
  if (fs.statSync(f).size > 2 * 1024 * 1024) continue;
  const text = fs.readFileSync(f, 'utf8');
  const lines = text.split('\n');
  lines.forEach((l, i) => { for (const [rule, re] of CHECKS) if (re.test(l)) findings.push({ file: f, line: i + 1, rule, text: l.trim().slice(0, 100) }); });
  if (/\.(md|txt|ya?ml|json)$/i.test(f)) for (const x of scanDescription(text)) findings.push({ file: f, line: null, rule: `injection:${x.rule}`, text: x.detail });
}
const serious = findings.filter((x) => !['hook-config'].includes(x.rule));
console.log(JSON.stringify({ status: serious.length ? 'review' : 'ok', reason: `${findings.length} finding(s) in ${targets.join(', ')}${findings.some((x) => x.rule === 'hook-config') ? '; ships hooks, which run on every matching event once enabled' : ''}` }));
for (const x of findings.slice(0, 20)) console.log(`${x.rule}: ${x.file}${x.line ? ':' + x.line : ''} ${x.text}`);
process.exit(0);
