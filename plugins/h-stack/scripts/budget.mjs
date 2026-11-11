#!/usr/bin/env node
// HS-010 context budget (ARCHITECTURE §9). Renders every injection and counts tokens with a
// fixed conservative estimator, ceil(bytes / 3), so CI needs no network.
import fs from 'node:fs';
import path from 'node:path';
import { splitFrontmatter } from '../lib/yaml.mjs';
import { allCases, setupProject, runCase } from './snapshot.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
export const tokens = (s) => Math.ceil(Buffer.byteLength(String(s || '')) / 3);
export const BUDGET = { listing: 900, sessionStart: 400, classifierLine: 60, alwaysOn: 1500, subagentStart: 150, eventNote: 40, perSkillListing: 512 };

function ctxOf(stdout) {
  try { const j = JSON.parse(stdout.trim().split('\n').pop()); return j.hookSpecificOutput?.additionalContext || j.reason || ''; } catch { return stdout; }
}

export function measure() {
  const rows = [];
  let listing = 0;
  const dir = path.join(ROOT, 'skills');
  for (const name of fs.existsSync(dir) ? fs.readdirSync(dir).sort() : []) {
    const f = path.join(dir, name, 'SKILL.md');
    if (!fs.existsSync(f)) continue;
    const { data } = splitFrontmatter(fs.readFileSync(f, 'utf8'));
    const t = tokens(`${data.name}: ${data.description} ${data.when_to_use || ''}`);
    listing += t;
    rows.push({ item: `listing ${name}`, tokens: t, budget: BUDGET.perSkillListing });
  }
  rows.push({ item: 'skill listing (all)', tokens: listing, budget: BUDGET.listing });
  const cases = allCases();
  const render = (pred) => cases.filter(pred).map((c) => { const p = setupProject(c); const r = ctxOf(runCase(c, p).stdout); fs.rmSync(p, { recursive: true, force: true }); return { name: c.name, text: r }; });
  // SessionStart: the static map plus a typical facts block.
  const ss = render((c) => c.hook === 'session-start.mjs');
  const ssMax = Math.max(0, ...ss.map((x) => tokens(x.text)));
  rows.push({ item: 'SessionStart output (largest fixture)', tokens: ssMax, budget: BUDGET.sessionStart });
  const cl = render((c) => c.hook === 'classify.mjs' && c.name !== 'classify-why-that' && c.name !== 'classify-lesson');
  const ls = render((c) => c.name === 'classify-lesson');
  for (const x of ls) { const lessonLines = x.text.split('\n').filter((l) => l.startsWith('H-Stack lesson')); rows.push({ item: 'lesson retrieval (<=2 lessons with excerpts)', tokens: tokens(lessonLines.join('\n')), budget: 840 }); rows.push({ item: 'lessons per prompt', tokens: lessonLines.length, budget: 2 }); }
  const clMax = Math.max(0, ...cl.map((x) => tokens(x.text.split('\n').filter((l) => !l.startsWith('H-Stack lesson')).join('\n'))));
  rows.push({ item: 'classifier line (largest fixture)', tokens: clMax, budget: BUDGET.classifierLine });
  rows.push({ item: 'always-on total (listing + SessionStart + one classifier line)', tokens: listing + ssMax + clMax, budget: BUDGET.alwaysOn });
  const sa = render((c) => c.hook === 'subagent-start.mjs');
  rows.push({ item: 'SubagentStart output', tokens: Math.max(0, ...sa.map((x) => tokens(x.text))), budget: BUDGET.subagentStart });
  const notes = render((c) => ['batch.mjs', 'taint.mjs', 'failure.mjs', 'repeat.mjs'].includes(c.hook) || (c.hook === 'ledger.mjs'));
  for (const n of notes) for (const line of n.text.split('\n').filter(Boolean)) rows.push({ item: `event note ${n.name}`, tokens: tokens(line), budget: BUDGET.eventNote });
  const direct = render((c) => c.name === 'classify-direct');
  rows.push({ item: 'direct prompt adds', tokens: Math.max(0, ...direct.map((x) => tokens(x.text))), budget: 0 });
  return rows;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const rows = measure();
  const over = rows.filter((r) => r.tokens > r.budget);
  const total = rows.find((r) => r.item.startsWith('always-on'));
  console.log(JSON.stringify({ status: over.length ? 'fail' : 'ok', reason: `always-on ${total.tokens}/${total.budget} tokens; listing ${rows.find((r) => r.item === 'skill listing (all)').tokens}/${BUDGET.listing}; ${over.length} row(s) over budget` }));
  if (process.argv.includes('--table')) for (const r of rows) console.log(`${String(r.tokens).padStart(5)} / ${String(r.budget).padEnd(5)} ${r.item}`);
  for (const r of over.slice(0, 8)) console.log(`over: ${r.item} ${r.tokens} > ${r.budget}`);
  process.exit(over.length ? 1 : 0);
}
