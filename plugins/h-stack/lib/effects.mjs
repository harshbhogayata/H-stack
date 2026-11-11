// HS-044 declared effects: parse task.yaml and decide whether an action is declared.
import fs from 'node:fs';
import { parseYaml } from './yaml.mjs';
import { matchesAny } from './core.mjs';

export function loadManifest(file) {
  const m = parseYaml(fs.readFileSync(file, 'utf8'));
  if (!m || !Array.isArray(m.effects)) throw new Error('task.yaml needs an effects list');
  return m;
}
// action: {kind: 'edit'|'bash'|'push'|'send', target: string}
export function declared(manifest, action) {
  for (const e of manifest.effects || []) {
    const [kind, val] = Object.entries(e)[0] || [];
    if (kind !== action.kind) continue;
    if (kind === 'edit' && matchesAny(action.target, [String(val)])) return true;
    if (kind === 'bash' && action.target.startsWith(String(val))) return true;
    if ((kind === 'push' || kind === 'send') && action.target.includes(String(val))) return true;
  }
  return false;
}
