#!/usr/bin/env node
// Opt-in project setup (OD-4, OD-10, IM-01, IM-11, HS-029). Plugins can't ship project rules or
// permissions, so this proposes them and writes nothing until run with --apply after the user saw
// the proposal. Never edits CLAUDE.md. Never installs other plugins (it prints the commands).
//   node ${CLAUDE_PLUGIN_ROOT}/scripts/setup.mjs            # show the proposal
//   node ${CLAUDE_PLUGIN_ROOT}/scripts/setup.mjs --apply [--no-rules] [--no-permissions] [--retention 90]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { proposedPermissionRules } from '../lib/protected.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const proj = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const args = process.argv.slice(2);
const apply = args.includes('--apply');
const retention = Number(args[args.indexOf('--retention') + 1]) || 90;
const settingsFile = path.join(proj, '.claude', 'settings.json');
const read = (f) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return {}; } };
const settings = read(settingsFile);
const rules = proposedPermissionRules();
rules.allow = rules.allow.map((r) => r.replace('${CLAUDE_PLUGIN_ROOT}', ROOT));
const merged = JSON.parse(JSON.stringify(settings));
merged.permissions ||= {};
for (const k of ['ask', 'deny', 'allow']) merged.permissions[k] = [...new Set([...(merged.permissions[k] || []), ...(args.includes('--no-permissions') ? [] : rules[k])])];
merged.cleanupPeriodDays = Math.max(settings.cleanupPeriodDays || 30, retention);
if (merged.autoMemoryEnabled === undefined) merged.autoMemoryEnabled = true;
const ruleFiles = args.includes('--no-rules') ? [] : fs.readdirSync(path.join(ROOT, 'rules-templates')).map((f) => ({ src: path.join(ROOT, 'rules-templates', f), dst: path.join(proj, '.claude', 'rules', 'h-stack', f) }));

const lines = [
  'H-Stack setup proposal (nothing written yet):',
  `1. ${path.relative(proj, settingsFile)}: add ${rules.ask.length} ask rules (CI, agent config, test-runner config, publish/merge/force-push), ${rules.deny.length} deny rules (H-Stack ledgers, secret files), allow ${rules.allow[0]}.`,
  `2. Same file: cleanupPeriodDays ${settings.cleanupPeriodDays || 30} -> ${merged.cleanupPeriodDays} (keeps transcripts reachable as lesson evidence, OD-10); autoMemoryEnabled ${merged.autoMemoryEnabled}.`,
  `3. Path-scoped rule files (load only when code files are touched): ${ruleFiles.map((r) => path.relative(proj, r.dst)).join(', ') || 'none'}.`,
  '4. Recommended native companions (install yourself if wanted): /plugin install skill-creator@claude-plugins-official, code-simplifier@claude-plugins-official, security-guidance@claude-plugins-official, claude-md-management@claude-plugins-official; Office/PDF skills from anthropics/skills.',
  apply ? 'Applying 1-3 now.' : 'Run again with --apply to write 1-3.',
];
console.log(lines.join('\n'));
if (apply) {
  fs.mkdirSync(path.dirname(settingsFile), { recursive: true });
  fs.writeFileSync(settingsFile, JSON.stringify(merged, null, 2) + '\n');
  for (const r of ruleFiles) { fs.mkdirSync(path.dirname(r.dst), { recursive: true }); if (!fs.existsSync(r.dst)) fs.copyFileSync(r.src, r.dst); }
  fs.mkdirSync(path.join(proj, '.h-stack'), { recursive: true });
  const cfg = path.join(proj, '.h-stack', 'config.json');
  if (!fs.existsSync(cfg)) fs.writeFileSync(cfg, JSON.stringify({ irreversible: { allowlist: [] }, tests: { globs: [] }, protected: { extra: [] } }, null, 2) + '\n');
  console.log(JSON.stringify({ status: 'ok', reason: `wrote ${path.relative(proj, settingsFile)}, ${ruleFiles.length} rule file(s) and .h-stack/config.json` }));
}
