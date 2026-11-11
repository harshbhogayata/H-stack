// HS-062 review findings schema, three verdicts, deterministic validator with truth checks.
// HS-063 shallow detector (K12). Malformed output is discarded and re-run, never repaired.
import fs from 'node:fs';
import path from 'node:path';

export const VERDICTS = ['confirmed', 'plausible', 'rejected'];
export const SEVERITIES = ['critical', 'high', 'medium', 'low'];

export function extractJson(text) {
  const s = String(text || '');
  const fenced = [...s.matchAll(/```(?:json)?\s*\n([\s\S]*?)```/g)].map((m) => m[1]);
  for (const cand of [...fenced.reverse(), s]) {
    try { const j = JSON.parse(cand.trim()); if (j && typeof j === 'object') return j; } catch { /* next */ }
  }
  return null;
}

export function validateFindings(obj, proj, opts = {}) {
  const errors = [];
  if (!obj || typeof obj !== 'object') return { ok: false, errors: ['no JSON object found'], shallow: false };
  if (!Array.isArray(obj.findings)) errors.push('findings must be an array');
  if (!Array.isArray(obj.cleared)) errors.push('cleared must be an array (units checked with no finding)');
  if (obj.not_reviewed !== undefined && !Array.isArray(obj.not_reviewed)) errors.push('not_reviewed must be an array');
  const max = opts.maxFindings ?? 10;
  const findings = Array.isArray(obj.findings) ? obj.findings : [];
  if (findings.length > max) errors.push(`more than ${max} findings (cap); keep the strongest`);
  findings.forEach((f, i) => {
    const at = `findings[${i}]`;
    for (const k of ['id', 'title', 'severity', 'verdict', 'file', 'line', 'evidence']) if (f[k] === undefined || f[k] === '') errors.push(`${at}.${k} missing`);
    if (f.verdict && !VERDICTS.includes(f.verdict)) errors.push(`${at}.verdict must be one of ${VERDICTS.join('|')}`);
    if (f.severity && !SEVERITIES.includes(f.severity)) errors.push(`${at}.severity must be one of ${SEVERITIES.join('|')}`);
    if (f.line !== undefined && !(Number.isInteger(f.line) && f.line > 0)) errors.push(`${at}.line must be a positive integer`);
    // Truth checks: the cited file and line exist and the quoted snippet is there.
    if (typeof f.file === 'string' && proj) {
      const abs = path.resolve(proj, f.file);
      if (!abs.startsWith(path.resolve(proj))) errors.push(`${at}.file is outside the project`);
      else if (!fs.existsSync(abs)) errors.push(`${at}.file ${f.file} does not exist`);
      else if (Number.isInteger(f.line)) {
        const lines = fs.readFileSync(abs, 'utf8').split('\n');
        if (f.line > lines.length) errors.push(`${at}.line ${f.line} is past the end of ${f.file} (${lines.length} lines)`);
        else if (typeof f.snippet === 'string' && f.snippet.trim()) {
          const win = lines.slice(Math.max(0, f.line - 3), f.line + 2).join('\n');
          const norm = (x) => x.replace(/\s+/g, ' ').trim();
          if (!norm(win).includes(norm(f.snippet).slice(0, 80))) errors.push(`${at}.snippet is not at ${f.file}:${f.line}`);
        }
      }
    }
  });
  const kept = findings.filter((f) => f.verdict !== 'rejected');
  const cleared = Array.isArray(obj.cleared) ? obj.cleared : [];
  const minCleared = opts.minCleared ?? 3;
  const shallow = errors.length === 0 && kept.length === 0 && cleared.length < minCleared;
  return { ok: errors.length === 0, errors, shallow, kept: kept.length, cleared: cleared.length };
}

// Schemas for the other structured subagents (HS-020, HS-060).
export function validateIntent(obj) {
  const errors = [];
  if (!obj || !['act', 'ask', 'stop'].includes(obj.decision)) errors.push('decision must be act, ask or stop');
  if (!Array.isArray(obj?.questions)) errors.push('questions must be an array');
  else if (obj.questions.length > 3) errors.push('at most three questions');
  else obj.questions.forEach((q, i) => { if (!q.text || !q.recommended) errors.push(`questions[${i}] needs text and recommended`); });
  if (obj?.decision === 'ask' && !(obj.questions || []).length) errors.push('ask needs at least one question');
  if (obj?.decision === 'stop' && !obj.stop_reason) errors.push('stop needs stop_reason');
  if (!Array.isArray(obj?.assumptions)) errors.push('assumptions must be an array');
  return { ok: errors.length === 0, errors, shallow: false };
}
export function validateRubric(obj) {
  const errors = [];
  const items = obj?.items;
  if (!Array.isArray(items) || !items.length) errors.push('items must be a non-empty array');
  else {
    if (items.length > 12) errors.push('at most 12 items');
    if (!items.some((i) => i.level === 'must')) errors.push('at least one must item');
    items.forEach((it, i) => { if (!it.id || !['must', 'important', 'nice'].includes(it.level) || !it.text || !it.check) errors.push(`items[${i}] needs id, level, text and check`); });
  }
  return { ok: errors.length === 0, errors, shallow: false };
}
export function validateGrades(obj, rubricIds = null) {
  const errors = [];
  const g = obj?.graded;
  if (!g || typeof g !== 'object') errors.push('graded must be an object keyed by item id');
  else for (const [id, v] of Object.entries(g)) { if (typeof v?.pass !== 'boolean' || !v.evidence) errors.push(`${id} needs pass (boolean) and evidence`); }
  if (g && rubricIds) for (const id of rubricIds) if (!(id in g)) errors.push(`item ${id} not graded`);
  return { ok: errors.length === 0, errors, shallow: false };
}
