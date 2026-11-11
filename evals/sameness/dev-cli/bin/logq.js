#!/usr/bin/env node
import { run } from '../src/commands/run.js';
import { saved } from '../src/commands/saved.js';
import { fail } from '../src/output.js';

const commands = { run, saved };
const [name, ...args] = process.argv.slice(2);

if (!name || !commands[name]) {
  fail(`unknown command: ${name ?? '(none)'}`, 'try: logq run --help', 2);
}
process.exitCode = await commands[name](args);
