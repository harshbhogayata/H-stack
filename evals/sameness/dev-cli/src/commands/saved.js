import fs from 'node:fs';
import path from 'node:path';
import { dataDir } from '../config.js';
import { emit, fail } from '../output.js';

const file = path.join(dataDir, 'saved.json');
const load = () => (fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {});

export async function saved([sub, ...args]) {
  const json = args.includes('--json');
  const all = load();
  if (sub === 'ls') {
    for (const [name, query] of Object.entries(all)) emit({ name, query }, { json });
    return 0;
  }
  if (sub === 'add') {
    const [name, query] = args;
    if (!name || !query) fail('saved add: missing <name> or <query>', 'usage: logq saved add <name> <query>');
    fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(file, JSON.stringify({ ...all, [name]: query }, null, 2));
    return 0;
  }
  fail(`saved: unknown subcommand: ${sub ?? '(none)'}`, 'try: logq saved ls');
}
