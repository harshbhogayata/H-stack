#!/usr/bin/env node
// SessionStart(startup|resume|clear|compact): byte-stable skill map + runtime facts (HS-017),
// failure-log tail after compaction (HS-047), outcome-unknown scan on resume (HS-036),
// wishlist (HS-053), plugin digest check (HS-083), retention sweep (§4.5). FAILURE_MODE=open
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { runHook, projectDir, stateDir, sessionDir, readJsonl, latestById, context, PLUGIN_ROOT, loadConfig } from '../lib/core.mjs';
import { loadIndex } from '../lib/index.mjs';

export function skillMap(index) {
  const skills = (index.skills || []).filter((s) => !s.hidden);
  if (!skills.length) return '';
  const rows = skills.map((s) => `${s.name}${s.explicit_only ? '*' : ''}: ${s.short}`);
  return `H-Stack skills (picked per prompt; no slash commands; * = only when asked): ${rows.join('; ')}. State and notes: \${CLAUDE_PLUGIN_ROOT}/bin/hs (assume, decide, wish, failed, stop).`;
}

function devServers() {
  const ports = new Set();
  for (const f of ['/proc/net/tcp', '/proc/net/tcp6']) {
    try {
      for (const line of fs.readFileSync(f, 'utf8').split('\n').slice(1)) {
        const cols = line.trim().split(/\s+/);
        if (cols[3] !== '0A') continue; // LISTEN
        const port = parseInt(cols[1].split(':').pop(), 16);
        if (port >= 3000 && port <= 9999) ports.add(port);
      }
    } catch { /* not linux */ }
  }
  if (!ports.size && process.platform === 'darwin') {
    try {
      const out = execFileSync('lsof', ['-nP', '-iTCP', '-sTCP:LISTEN'], { encoding: 'utf8', timeout: 1000, stdio: ['ignore', 'pipe', 'ignore'] });
      for (const m of out.matchAll(/:(\d{4})\s+\(LISTEN\)/g)) { const p = Number(m[1]); if (p >= 3000 && p <= 9999) ports.add(p); }
    } catch { /* none */ }
  }
  return [...ports].sort((a, b) => a - b).slice(0, 5);
}

function openPr(proj) {
  try {
    const out = execFileSync('gh', ['pr', 'view', '--json', 'number,url,state'], { cwd: proj, encoding: 'utf8', timeout: 2000, stdio: ['ignore', 'pipe', 'ignore'] });
    const j = JSON.parse(out);
    return j.state === 'OPEN' ? `#${j.number} ${j.url}` : null;
  } catch { return null; }
}

function unansweredCalls(transcript) {
  try {
    const lines = fs.readFileSync(transcript, 'utf8').split('\n').slice(-400);
    const uses = new Map(); const results = new Set();
    for (const l of lines) {
      let j; try { j = JSON.parse(l); } catch { continue; }
      const content = j?.message?.content;
      if (!Array.isArray(content)) continue;
      for (const c of content) {
        if (c.type === 'tool_use') uses.set(c.id, `${c.name} ${JSON.stringify(c.input || {}).slice(0, 60)}`);
        if (c.type === 'tool_result') results.add(c.tool_use_id);
      }
    }
    return [...uses].filter(([id]) => !results.has(id)).map(([, d]) => d).slice(-3);
  } catch { return []; }
}

function digestProblems() {
  const file = path.join(PLUGIN_ROOT, 'THIRD_PARTY.md');
  let text = '';
  try { text = fs.readFileSync(file, 'utf8'); } catch { return []; }
  const bad = [];
  for (const m of text.matchAll(/`(skills\/[^`]+)`\s*sha256:([0-9a-f]{64})/g)) {
    try {
      const h = crypto.createHash('sha256').update(fs.readFileSync(path.join(PLUGIN_ROOT, m[1]))).digest('hex');
      if (h !== m[2]) bad.push(m[1]);
    } catch { bad.push(m[1]); }
  }
  return bad;
}

function sweep(proj, config) {
  const start = Date.now();
  const dir = path.join(proj, '.h-stack', 'sessions');
  const cutoff = Date.now() - (config.retention?.sessions_days ?? 30) * 864e5;
  try {
    for (const d of fs.readdirSync(dir)) {
      if (Date.now() - start > 150) break;
      const p = path.join(dir, d);
      try { if (fs.statSync(p).mtimeMs < cutoff) fs.rmSync(p, { recursive: true, force: true }); } catch { /* */ }
    }
  } catch { /* none yet */ }
}

await runHook('session-start', 'open', async (input) => {
  const proj = projectDir(input);
  const sid = input.session_id || 'no-session';
  const source = input.source || 'startup';
  stateDir(proj);
  const config = loadConfig(proj);
  sweep(proj, config);
  const parts = [];
  const map = skillMap(loadIndex());
  if (map) parts.push(map);
  const facts = [];
  const pr = openPr(proj);
  if (pr) facts.push(`open PR: ${pr}`);
  const ports = devServers();
  if (ports.length) facts.push(`listening dev ports: ${ports.map((p) => `http://localhost:${p}`).join(', ')}`);
  const wishes = latestById(readJsonl(path.join(proj, '.h-stack', 'wishlist.jsonl'))).filter((w) => w.status === 'open');
  if (wishes.length) facts.push(`open wishlist: ${wishes.slice(0, 3).map((w) => `${w.id} ${String(w.need).slice(0, 60)}`).join('; ')}`);
  const cpDir = path.join(sessionDir(proj, sid), 'checkpoints');
  let cps = [];
  try { cps = fs.readdirSync(cpDir).filter((f) => f.endsWith('.md')).sort(); } catch { /* none */ }
  if (cps.length) facts.push(`last checkpoint: .h-stack/sessions/${path.basename(path.dirname(cpDir))}/checkpoints/${cps[cps.length - 1]}`);
  if (source === 'compact') {
    const fails = readJsonl(path.join(sessionDir(proj, sid), 'failures.jsonl')).slice(-5);
    if (fails.length) facts.push(`failed approaches so far (do not retry without a new signal): ${fails.map((f) => `${String(f.tried).slice(0, 60)} → ${String(f.failed_because).slice(0, 60)}`).join(' | ')}`);
  }
  if (source === 'resume' && input.transcript_path) {
    const un = unansweredCalls(input.transcript_path);
    if (un.length) facts.push(`outcome unknown for ${un.length} interrupted call(s) (${un.join('; ')}); retry only read-only or idempotent steps`);
  }
  const bad = digestProblems();
  if (bad.length) facts.push(`plugin files differ from THIRD_PARTY.md digests: ${bad.slice(0, 3).join(', ')}; treat those skills as unverified`);
  if (facts.length) parts.push(`H-Stack facts: ${facts.sort().join('. ')}.`);
  return context('SessionStart', parts.join('\n'));
});
