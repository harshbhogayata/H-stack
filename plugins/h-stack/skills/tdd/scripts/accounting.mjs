#!/usr/bin/env node
// HS-079 accounting gate for migrations. Every source id must appear in the target or in a
// "not migrated" list with a reason; counts are compared per stage and any gap stops the run.
//   node accounting.mjs --source ids.txt --target ids.txt [--skipped skipped.tsv] [--stage name=ids.txt ...]
// Files: one id per line (skipped.tsv: "<id>\t<reason>"). Exit 1 on any unaccounted item.
import fs from 'node:fs';
const a = process.argv.slice(2);
const opt = (k) => { const i = a.indexOf(`--${k}`); return i >= 0 ? a[i + 1] : null; };
const ids = (f) => (f ? fs.readFileSync(f, 'utf8').split('\n').map((l) => l.split('\t')[0].trim()).filter(Boolean) : []);
if (!opt('source') || !opt('target')) { console.log('usage: accounting.mjs --source ids.txt --target ids.txt [--skipped skipped.tsv] [--stage name=ids.txt ...]'); process.exit(2); }
const source = ids(opt('source')); const target = new Set(ids(opt('target')));
const skippedRows = opt('skipped') ? fs.readFileSync(opt('skipped'), 'utf8').split('\n').filter(Boolean).map((l) => l.split('\t')) : [];
const noReason = skippedRows.filter(([, r]) => !r || !r.trim()).map(([id]) => id);
const skipped = new Set(skippedRows.map(([id]) => id.trim()));
const dupes = source.filter((x, i) => source.indexOf(x) !== i);
const missing = source.filter((id) => !target.has(id) && !skipped.has(id));
const both = source.filter((id) => target.has(id) && skipped.has(id));
const srcSet = new Set(source);
const extra = [...target].filter((id) => !srcSet.has(id));
const stages = a.flatMap((x, i) => (x === '--stage' ? [a[i + 1]] : [])).map((s) => { const [name, f] = s.split('='); return { name, n: new Set(ids(f)).size }; });
const expected = srcSet.size - skipped.size;
const badStages = stages.filter((st) => st.n !== expected).map((st) => `${st.name} has ${st.n}, expected ${expected}`);
const report = { source: srcSet.size, target: target.size, skipped: skipped.size, stages, missing: missing.length, extra: extra.length, duplicates: dupes.length, skipped_without_reason: noReason.length, in_both: both.length };
const ok = !missing.length && !noReason.length && !both.length && !badStages.length && srcSet.size === target.size - extra.length + skipped.size;
console.log(JSON.stringify({ status: ok ? 'ok' : 'fail', ...report }));
for (const [k, list] of [['stage count', badStages], ['missing', missing], ['extra in target', extra], ['skipped without reason', noReason], ['both migrated and skipped', both], ['duplicate source id', dupes]]) for (const id of list.slice(0, 10)) console.log(`${k}: ${id}`);
process.exit(ok ? 0 : 1);
