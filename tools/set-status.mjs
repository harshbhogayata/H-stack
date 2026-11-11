#!/usr/bin/env node
// Maintainer tool: set the Status of HS items or IM rows in BACKLOG.md.
//   node tools/set-status.mjs HS-010 done "budget.mjs in CI"
//   node tools/set-status.mjs "IM-06" done "skills/debugging" [--match systematic-debugging]
import fs from 'node:fs';
const [id, status, detail = '', ...rest] = process.argv.slice(2);
const match = rest[rest.indexOf('--match') + 1];
if (!/^(done|needs-user|dropped)$/.test(status)) throw new Error('status must be done|needs-user|dropped');
const file = new URL('../BACKLOG.md', import.meta.url);
let text = fs.readFileSync(file, 'utf8');
const value = status === 'done' ? `done${detail ? ` — ${detail}` : ''}` : `${status} (${detail})`;
if (id.startsWith('HS-')) {
  const re = new RegExp(`(#### ${id} [^\\n]*\\n\\*\\*[^\\n]*\\*\\*\\n)((?:- \\*\\*Status\\.\\*\\*[^\\n]*\\n)?)`);
  if (!re.test(text)) throw new Error(`${id} not found`);
  text = text.replace(re, `$1- **Status.** ${value}\n`);
} else {
  const lines = text.split('\n');
  let n = 0;
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].startsWith(`| ${id} |`)) continue;
    if (match && !lines[i].includes(match)) continue;
    const cells = lines[i].split('|');
    cells[cells.length - 2] = ` ${value.replace(/\|/g, '/')} `;
    lines[i] = cells.join('|');
    n++;
  }
  if (!n) throw new Error(`${id} row not found`);
  text = lines.join('\n');
}
fs.writeFileSync(file, text);
console.log(`${id}${match ? ' ' + match : ''}: ${value}`);
