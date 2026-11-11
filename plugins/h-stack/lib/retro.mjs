// Measured retro over local telemetry (HS-058 retention, HS-021 routing examples, HS-025 solo
// boundary, HS-059 retro). Pure functions plus thin file helpers; nothing leaves the machine.
import fs from 'node:fs';
import path from 'node:path';
import { readJsonl, writeJsonAtomic, stateDir, git } from './core.mjs';

export const RETENTION_DAYS = 90;
export const SOLO = { minRuns: 5, receiptsOnlyAt: 0.9 };

export function pruneRows(rows, now, days = RETENTION_DAYS) {
  const floor = now - days * 864e5;
  return rows.filter((r) => typeof r.ts !== 'number' || r.ts >= floor);
}

// Drop telemetry rows older than the retention window; at most once a day.
export function pruneTelemetry(proj, now = Date.now()) {
  const dir = path.join(stateDir(proj), 'telemetry');
  const stamp = path.join(dir, '.pruned');
  try { if (now - fs.statSync(stamp).mtimeMs < 864e5) return 0; } catch { /* first run */ }
  let dropped = 0;
  for (const f of fs.existsSync(dir) ? fs.readdirSync(dir).filter((x) => x.endsWith('.jsonl')) : []) {
    const file = path.join(dir, f);
    const rows = readJsonl(file);
    const kept = pruneRows(rows, now);
    if (kept.length === rows.length) continue;
    dropped += rows.length - kept.length;
    const tmp = `${file}.tmp`;
    fs.writeFileSync(tmp, kept.map((r) => JSON.stringify(r)).join('\n') + (kept.length ? '\n' : ''));
    fs.renameSync(tmp, file);
  }
  try { fs.mkdirSync(dir, { recursive: true }); fs.writeFileSync(stamp, String(now)); } catch { /* ignore */ }
  return dropped;
}

export const taskClass = (r) => (r.picked && r.picked[0]) || `size:${r.size || 'light'}`;

// Solo pass = a routed turn that the next prompt in the same session did not correct.
export function soloBoundary(activation) {
  const bySession = new Map();
  for (const r of activation) { if (!bySession.has(r.session)) bySession.set(r.session, []); bySession.get(r.session).push(r); }
  const stats = {};
  for (const rows of bySession.values()) {
    rows.sort((a, b) => a.ts - b.ts);
    rows.forEach((r, i) => {
      if (r.size === 'direct' || r.override) return;
      const next = rows[i + 1];
      const c = taskClass(r);
      const s = (stats[c] ||= { runs: 0, passed: 0 });
      s.runs += 1;
      if (!(next && next.correction_of_previous)) s.passed += 1;
    });
  }
  for (const s of Object.values(stats)) { s.pass_rate = s.runs ? Number((s.passed / s.runs).toFixed(2)) : 0; s.verify = effortFor(s); }
  return stats;
}

export function effortFor(s) {
  if (!s || s.runs < SOLO.minRuns) return 'medium';
  return s.pass_rate >= SOLO.receiptsOnlyAt ? 'receipts' : 'full';
}

export function toolCounts(tools) {
  const c = {};
  for (const r of tools) c[r.tool || 'unknown'] = (c[r.tool || 'unknown'] || 0) + 1;
  return Object.fromEntries(Object.entries(c).sort((a, b) => b[1] - a[1]));
}

export function activationSummary(activation) {
  const routed = activation.filter((r) => r.picked && r.picked.length);
  const corrections = activation.filter((r) => r.correction_of_previous && r.correction_of_previous.length);
  const perSkill = {};
  for (const r of routed) for (const s of r.picked) perSkill[s] = (perSkill[s] || 0) + 1;
  return { prompts: activation.length, routed: routed.length, corrections: corrections.length, per_skill: perSkill };
}

// HS-059: measured signals from git. commits = [{sha, ts, subject, files[]}], newest first.
export function parseGitLog(text) {
  const out = [];
  for (const block of String(text || '').split('\x1e').map((b) => b.trim()).filter(Boolean)) {
    const [head, ...files] = block.split('\n').map((l) => l.trim()).filter(Boolean);
    const [sha, ts, ...subj] = head.split('\x1f');
    out.push({ sha, ts: Number(ts) * 1000, subject: subj.join(' '), files });
  }
  return out;
}

export function gitSignals(commits, activation, now = Date.now(), days = 30) {
  const floor = now - days * 864e5;
  const cs = commits.filter((c) => c.ts >= floor);
  const reverts = cs.filter((c) => /^revert\b/i.test(c.subject)).length;
  const touch = {};
  for (const c of cs) for (const f of c.files) touch[f] = (touch[f] || 0) + 1;
  const rework = Object.entries(touch).filter(([, n]) => n >= 3).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([file, n]) => ({ file, commits: n }));
  const asc = [...cs].sort((a, b) => a.ts - b.ts);
  const leads = activation.filter((r) => r.ts >= floor && r.picked && r.picked.length).map((r) => { const c = asc.find((x) => x.ts >= r.ts && x.ts - r.ts < 864e5); return c ? (c.ts - r.ts) / 60000 : null; }).filter((x) => x !== null).sort((a, b) => a - b);
  return { window_days: days, commits: cs.length, reverts, revert_rate: cs.length ? Number((reverts / cs.length).toFixed(3)) : 0, rework, median_minutes_request_to_commit: leads.length ? Math.round(leads[Math.floor(leads.length / 2)]) : null };
}

// HS-051: files Claude edited that a later commit changed when no H-Stack prompt was active in
// the 30 minutes before it: likely the user's own corrections, worth reading for a preference.
export function userEditCandidates(edits, commits, activation, quietMs = 30 * 60000) {
  const prompts = activation.map((r) => r.ts).sort((a, b) => a - b);
  const lastEdit = {};
  for (const e of edits) if (e.path) lastEdit[e.path] = Math.max(lastEdit[e.path] || 0, e.ts || 0);
  const out = [];
  for (const c of commits) {
    const busy = prompts.some((t) => t <= c.ts && c.ts - t < quietMs);
    if (busy) continue;
    for (const f of c.files) if (lastEdit[f] && c.ts > lastEdit[f]) out.push({ file: f, commit: c.sha.slice(0, 12), subject: c.subject.slice(0, 80) });
  }
  return out.slice(0, 20);
}

export function retro(proj) {
  const t = path.join(stateDir(proj), 'telemetry');
  const activation = readJsonl(path.join(t, 'activation.jsonl'));
  const tools = readJsonl(path.join(t, 'tools.jsonl'));
  const turns = readJsonl(path.join(t, 'mod-turns.jsonl'));
  const solo = soloBoundary(activation);
  writeJsonAtomic(path.join(stateDir(proj), 'solo-boundary.json'), solo);
  const examples = readJsonl(path.join(stateDir(proj), 'routing-examples.jsonl'));
  const commits = parseGitLog(git(proj, ['log', '-n', '500', '--since=90.days', '--name-only', '--format=%x1e%H%x1f%ct%x1f%s'], { timeout: 8000 }));
  const sessions = path.join(stateDir(proj), 'sessions');
  const edits = (fs.existsSync(sessions) ? fs.readdirSync(sessions) : []).flatMap((d) => readJsonl(path.join(sessions, d, 'ledger.jsonl')).filter((r) => r.kind === 'edit'));
  const toolCalls = {};
  for (const r of turns) for (const [k, v] of Object.entries(r.tools || {})) toolCalls[k] = (toolCalls[k] || 0) + v;
  const tok = turns.reduce((a, r) => a + (r.input_tokens || 0) + (r.output_tokens || 0), 0);
  return {
    activation: activationSummary(activation),
    tools: toolCounts(tools),
    tool_calls: Object.fromEntries(Object.entries(toolCalls).sort((a, b) => b[1] - a[1])),
    git: gitSignals(commits, activation),
    user_edit_candidates: userEditCandidates(edits, commits, activation),
    turns: { count: turns.length, tokens: tok, steps: turns.reduce((a, r) => a + (r.steps || 0), 0), aborted: turns.filter((r) => r.aborted).length },
    solo_boundary: solo,
    routing_examples: examples.length,
  };
}
