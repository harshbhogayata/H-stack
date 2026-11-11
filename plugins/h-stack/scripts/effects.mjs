#!/usr/bin/env node
// HS-044: validate a plan (JSON list of {kind, target}) against task.yaml's declared effects.
//   node effects.mjs validate task.yaml plan.json
import fs from 'node:fs';
import { loadManifest, declared } from '../lib/effects.mjs';
const [sub, manifestFile, planFile] = process.argv.slice(2);
if (sub !== 'validate' || !manifestFile || !planFile) { console.log(JSON.stringify({ status: 'error', reason: 'usage: effects.mjs validate task.yaml plan.json' })); process.exit(2); }
const m = loadManifest(manifestFile);
const plan = JSON.parse(fs.readFileSync(planFile, 'utf8'));
const actions = Array.isArray(plan) ? plan : plan.actions || [];
const bad = actions.filter((a) => !declared(m, a));
console.log(JSON.stringify({ status: bad.length ? 'fail' : 'ok', reason: `${actions.length - bad.length}/${actions.length} planned action(s) are declared in ${manifestFile}`, undeclared: bad }));
process.exit(bad.length ? 1 : 0);
