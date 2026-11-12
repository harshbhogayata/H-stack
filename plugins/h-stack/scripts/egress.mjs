#!/usr/bin/env node
// HS-014 egress inventory. By default nothing leaves the machine except the user's own model
// calls. This lists every place plugin code can reach the network and fails CI when a new one
// appears that is not in the inventory below (add it here, with its trigger, to accept it).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const INVENTORY = {
  'registry.npmjs.org': 'dependency gate (HS-031): package name only, only when the agent adds a dependency; 7-day cache',
  'api.npmjs.org': 'dependency gate: weekly downloads for the same package',
  'pypi.org': 'dependency gate: PyPI metadata', 'pypistats.org': 'dependency gate: PyPI downloads',
  'crates.io': 'dependency gate: crate metadata', 'proxy.golang.org': 'dependency gate: Go module metadata',
  'rubygems.org': 'dependency gate: gem metadata',
  'exec:gh': 'SessionStart reads the open PR for the current branch with the user\'s own gh login (skipped when gh is absent)',
  'model:$.model.complete': 'mods: classifier fallback and concern check, both off by default; the user\'s own model calls',
};
const SCAN = ['hooks', 'lib', 'bin', 'scripts'];
const found = new Map();
function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) { if (f !== 'node_modules') walk(p); continue; }
    if (!/\.(mjs|js|cjs)$|^hs$/.test(f) || p.endsWith('scripts/egress.mjs')) continue;
    const src = fs.readFileSync(p, 'utf8');
    const rel = path.relative(ROOT, p);
    const add = (k) => { if (!found.has(k)) found.set(k, new Set()); found.get(k).add(rel); };
    for (const m of src.matchAll(/(?:fetch|getJson|https?\.request|https?\.get)\(\s*[`'"]https?:\/\/([a-z0-9.-]+)/gi)) add(m[1]);
    if (/\b(fetch|https?\.(request|get))\(\s*[a-z_]/i.test(src) && !/getJson\(/.test(src)) add(`dynamic-fetch:${rel}`);
    for (const m of src.matchAll(/exec(?:File)?(?:Sync)?\(\s*'(gh|curl|wget|nc|ssh|scp)'/g)) add(`exec:${m[1]}`);
    if (/\$\.model\.complete\(/.test(src)) add('model:$.model.complete');
  }
}
for (const d of SCAN) if (fs.existsSync(path.join(ROOT, d))) walk(path.join(ROOT, d));
const unknown = [...found.keys()].filter((k) => !INVENTORY[k]);
console.log(JSON.stringify({ status: unknown.length ? 'fail' : 'ok', reason: `${found.size} egress point(s), ${unknown.length} not in the inventory` }));
for (const k of unknown) console.log(`not in inventory: ${k} (${[...found.get(k)].join(', ')})`);
if (process.argv.includes('--list')) for (const [k, v] of found) console.log(`${k}: ${INVENTORY[k] || '?'} [${[...v].join(', ')}]`);
process.exit(unknown.length ? 1 : 0);
