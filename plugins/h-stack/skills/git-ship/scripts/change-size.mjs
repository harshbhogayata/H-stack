#!/usr/bin/env node
// HS-073 change-size governor: compare the current change with what this project usually merges.
//   node change-size.mjs [--base <ref>]
// Threshold = 75th percentile of lines changed per merged change (merge commits, else first-parent
// commits) over the last 100 on the base branch. Prints one JSON {status, reason, ...}.
import { execFileSync } from 'node:child_process';

const proj = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const git = (...a) => { try { return execFileSync('git', ['-C', proj, ...a], { encoding: 'utf8', maxBuffer: 64 << 20 }); } catch { return ''; } };
const args = process.argv.slice(2);
const base = args[args.indexOf('--base') + 1] && args.includes('--base') ? args[args.indexOf('--base') + 1] : (git('symbolic-ref', '--short', 'refs/remotes/origin/HEAD').trim() || 'main');
const lines = (stat) => { const m = stat.match(/(\d+) insertions?\(\+\)/); const d = stat.match(/(\d+) deletions?\(-\)/); return (m ? +m[1] : 0) + (d ? +d[1] : 0); };
const mergeBase = git('merge-base', base, 'HEAD').trim();
const current = lines(git('diff', '--shortstat', mergeBase || 'HEAD')) ;
let sizes = git('log', base, '--merges', '-n', '100', '--format=%H').split('\n').filter(Boolean).map((h) => lines(git('diff', '--shortstat', `${h}^1`, h)));
let source = 'merge commits';
if (sizes.length < 10) { sizes = git('log', base, '--first-parent', '--no-merges', '-n', '100', '--shortstat', '--format=@@').split('@@').map((s) => lines(s)).filter((n) => n > 0); source = 'first-parent commits'; }
if (sizes.length < 10) { console.log(JSON.stringify({ status: 'ok', reason: `not enough history (${sizes.length} changes) to set a threshold; current change is ${current} lines`, current })); process.exit(0); }
sizes.sort((a, b) => a - b);
const p75 = sizes[Math.floor(sizes.length * 0.75)];
const median = sizes[Math.floor(sizes.length / 2)];
const big = current > p75;
console.log(JSON.stringify({ status: big ? 'split-suggested' : 'ok', reason: big ? `current change is ${current} lines; this project's ${source} are usually <= ${p75} (median ${median}). Consider stacked steps, each with its own tests.` : `current change is ${current} lines (75th percentile ${p75}, median ${median})`, current, p75, median, history: sizes.length, source }));
