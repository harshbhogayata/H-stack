import fs from 'node:fs';
import { readConfig } from '../config.js';
import { emit, fail } from '../output.js';

function matcher(query) {
  const terms = query.split(/\s+/).filter(Boolean).map((t) => t.split('='));
  return (rec) => terms.every(([k, v]) => String(rec[k]) === v);
}

export async function run(args) {
  const json = args.includes('--json');
  const [query, ...files] = args.filter((a) => !a.startsWith('--'));
  if (!query) fail('run: missing <query>', 'usage: logq run [--json] <query> <file...>');
  const { limit } = readConfig();
  const match = matcher(query);
  let n = 0;
  for (const f of files) {
    for (const line of fs.readFileSync(f, 'utf8').split('\n')) {
      if (!line || n >= limit) continue;
      const rec = JSON.parse(line);
      if (match(rec)) { emit({ ...rec, line }, { json }); n++; }
    }
  }
  return n ? 0 : 1;
}
