#!/usr/bin/env node
// HS-083 supply-chain record. Source of truth: third-party.json. Renders THIRD_PARTY.md with
// per-file SHA-256 of the shipped files (and the upstream file's SHA-256 at the pinned commit).
// --write regenerates; default checks: licence allowed, LICENSE present, commit pinned, digests match.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const ALLOWED = new Set(['MIT', 'Apache-2.0', 'BSD-2-Clause', 'BSD-3-Clause', 'ISC']);
const sha = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');

export function render(data) {
  const out = ['# Third-party skills', '', 'Every imported file, pinned to an upstream commit, with the SHA-256 of the shipped file and of the upstream original. Generated from `third-party.json` by `scripts/third-party.mjs --write`; CI fails if a shipped file no longer matches.', '', '| skill | upstream repo › path | commit | licence | sha256 (per file) | changes |', '|---|---|---|---|---|---|'];
  for (const r of data.imports) {
    const files = r.files.map((f) => `\`${f.shipped}\` sha256:${sha(path.join(ROOT, f.shipped))}`).join('<br>');
    out.push(`| ${r.skill} | ${r.repo} › \`${r.path}\` | \`${r.commit}\` | ${r.licence} | ${files} | ${r.changes} |`);
  }
  out.push('', '## Upstream originals', '', 'SHA-256 of each upstream file at the pinned commit, so the source can be re-checked.', '');
  for (const r of data.imports) for (const f of r.files) if (f.upstream) out.push(`- ${r.repo}@${r.commit.slice(0, 12)} \`${f.upstream}\` upstream-sha256:${f.upstream_sha256} → \`${f.shipped}\``);
  if (data.dropped?.length) {
    out.push('', '## Considered and not shipped', '');
    for (const d of data.dropped) out.push(`- ${d.repo} › \`${d.path}\` (${d.licence}): ${d.reason}`);
  }
  return out.join('\n') + '\n';
}

export function check(data) {
  const errs = [];
  for (const r of data.imports) {
    if (!ALLOWED.has(r.licence)) errs.push(`${r.skill}: licence ${r.licence} not allowed`);
    if (!/^[0-9a-f]{40}$/.test(r.commit)) errs.push(`${r.skill}: commit must be a full 40-hex SHA`);
    const dir = path.join(ROOT, 'skills', r.skill);
    if (!fs.existsSync(path.join(dir, 'LICENSE'))) errs.push(`${r.skill}: LICENSE missing`);
    else if (!fs.readFileSync(path.join(dir, 'LICENSE'), 'utf8').includes(r.copyright || '')) errs.push(`${r.skill}: LICENSE lacks the upstream copyright notice`);
    for (const f of r.files) if (!fs.existsSync(path.join(ROOT, f.shipped))) errs.push(`${r.skill}: ${f.shipped} listed but missing`);
    if (!r.changes) errs.push(`${r.skill}: changes not recorded`);
  }
  const md = path.join(ROOT, 'THIRD_PARTY.md');
  if (!fs.existsSync(md)) errs.push('THIRD_PARTY.md missing');
  else if (fs.readFileSync(md, 'utf8') !== render(data)) errs.push('THIRD_PARTY.md digests are stale or edited by hand; run scripts/third-party.mjs --write after reviewing the change');
  return errs;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'third-party.json'), 'utf8'));
  if (process.argv.includes('--write')) { fs.writeFileSync(path.join(ROOT, 'THIRD_PARTY.md'), render(data)); console.log(JSON.stringify({ status: 'ok', reason: `wrote THIRD_PARTY.md (${data.imports.length} imports)` })); process.exit(0); }
  const errs = check(data);
  console.log(JSON.stringify({ status: errs.length ? 'fail' : 'ok', reason: `${data.imports.length} imports checked; ${errs.length} problem(s)` }));
  for (const e of errs.slice(0, 10)) console.log(e);
  process.exit(errs.length ? 1 : 0);
}
