// H-Stack shared core: zero-dependency helpers used by every hook, script and bin/hs.
// Output contract (HS-012): <=10 stdout lines, one refusal format, full output to .h-stack/logs/.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

export const PLUGIN_ROOT = process.env.CLAUDE_PLUGIN_ROOT || path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
export const MAX_LINE_BYTES = 4096;

// ---------- input ----------
export function readStdin() {
  try {
    const raw = fs.readFileSync(0, 'utf8');
    return raw.trim() ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function projectDir(input = {}) {
  return process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
}

// ---------- deterministic serialisation (HS-011) ----------
export function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') {
    const out = {};
    for (const k of Object.keys(value).sort()) out[k] = stable(value[k]);
    return out;
  }
  return value;
}
export const stableStringify = (v) => JSON.stringify(stable(v));
export const sha = (s, n = 64) => crypto.createHash('sha256').update(String(s)).digest('hex').slice(0, n);

// ---------- redaction (ARCHITECTURE §4.5) ----------
const SECRET_PATTERNS = [
  [/\b(sk-ant-[A-Za-z0-9_-]{10,})/g, '[REDACTED:anthropic-key]'],
  [/\b(sk-[A-Za-z0-9]{20,})/g, '[REDACTED:api-key]'],
  [/\b(gh[pousr]_[A-Za-z0-9]{20,})/g, '[REDACTED:github-token]'],
  [/\b(github_pat_[A-Za-z0-9_]{20,})/g, '[REDACTED:github-token]'],
  [/\b(xox[abprs]-[A-Za-z0-9-]{10,})/g, '[REDACTED:slack-token]'],
  [/\b(AKIA[0-9A-Z]{16})\b/g, '[REDACTED:aws-key]'],
  [/\b(AIza[0-9A-Za-z_-]{35})\b/g, '[REDACTED:google-key]'],
  [/(-----BEGIN [A-Z ]*PRIVATE KEY-----)[\s\S]*?(-----END [A-Z ]*PRIVATE KEY-----)/g, '[REDACTED:private-key]'],
  [/(authorization:\s*)(bearer|basic|token)?\s*[^\s"']+/gi, '$1[REDACTED]'],
  [/\b((?:api[_-]?key|secret|password|passwd|token|access[_-]?key)\s*[=:]\s*)["']?[^\s"']{8,}/gi, '$1[REDACTED]'],
];
export function redact(text) {
  let s = String(text ?? '');
  for (const [re, rep] of SECRET_PATTERNS) s = s.replace(re, rep);
  return s;
}
export function looksLikeSecret(text) {
  return SECRET_PATTERNS.slice(0, 8).some(([re]) => { re.lastIndex = 0; return re.test(String(text)); });
}

// ---------- state (.h-stack/, ARCHITECTURE §4.2) ----------
export function stateDir(proj) {
  const dir = path.join(proj, '.h-stack');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, '.gitignore'), '*\n!.gitignore\n!config.json\n');
  }
  return dir;
}
export function sessionDir(proj, sid) {
  let safe = String(sid || 'no-session').replace(/[^A-Za-z0-9_.-]/g, '_').slice(0, 80);
  if (/^\.+$/.test(safe)) safe = 'no-session'; // '.' and '..' must not leave sessions/ (self-audit hardening)
  const dir = path.join(stateDir(proj), 'sessions', safe);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}
export function activeSession(proj) {
  try { return fs.readFileSync(path.join(proj, '.h-stack', 'active-session'), 'utf8').trim(); } catch { return ''; }
}

// Atomic single-line append (§4.4): one write() of one line <= 4 KB with O_APPEND.
export function appendLine(file, obj, proj) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  let line = redact(stableStringify(obj));
  if (Buffer.byteLength(line) + 1 > MAX_LINE_BYTES) {
    const ref = proj ? logFull(proj, path.basename(file, '.jsonl'), line) : null;
    const slim = { ...obj };
    for (const k of Object.keys(slim)) if (typeof slim[k] === 'string' && slim[k].length > 200) slim[k] = slim[k].slice(0, 200) + '…';
    slim.overflow = ref;
    line = redact(stableStringify(slim)).slice(0, MAX_LINE_BYTES - 2);
  }
  const fd = fs.openSync(file, 'a');
  try { fs.writeSync(fd, line + '\n'); } finally { fs.closeSync(fd); }
}
export function readJsonl(file) {
  try {
    return fs.readFileSync(file, 'utf8').split('\n').filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
  } catch { return []; }
}
// Latest line per id wins (no in-place edits, §4.4 rule 3).
export function latestById(rows) {
  const m = new Map();
  for (const r of rows) if (r && r.id) m.set(r.id, { ...(m.get(r.id) || {}), ...r });
  return [...m.values()];
}
export function writeJsonAtomic(file, obj) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = file + '.' + process.pid + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(stable(obj), null, 2) + '\n');
  fs.renameSync(tmp, file);
}
export function readJson(file, fallback = null) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return fallback; }
}
export function logFull(proj, name, text) {
  const dir = path.join(stateDir(proj), 'logs');
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${name}-${sha(text, 12)}.log`);
  fs.writeFileSync(file, redact(text));
  return path.relative(proj, file);
}

// ---------- config ----------
export const DEFAULT_CONFIG = {
  irreversible: { allowlist: [], extra_patterns: [] },
  tests: { globs: [] },
  protected: { extra: [] },
  deps: { lookup: true, min_age_days: 30, min_weekly_downloads: 50, cache_days: 7 },
  budgets: { steps: { direct: 20, light: 60, full: 200 }, spawn: { direct: 0, light: 1, full: 5 } },
  classifier: { fallback: false },
  long_run: { overseer: false },
  retention: { sessions_days: 30, telemetry_days: 90, other_days: 180 },
  claims: {
    test: '\\b(test|tests|pytest|jest|vitest|mocha|ava|rspec|phpunit|ctest|go test|cargo test|npm t|bun test|deno test|unittest|tox|nox)\\b',
    build: '\\b(build|compile|tsc|make|cargo build|go build|webpack|vite build|gradle|mvn|bazel)\\b',
    lint: '\\b(lint|eslint|ruff|flake8|pylint|clippy|golangci|rubocop|biome|prettier --check|stylelint)\\b',
    typecheck: '\\b(tsc|mypy|pyright|typecheck|type-check|flow check)\\b',
  },
};
function deepMerge(a, b) {
  if (!b || typeof b !== 'object' || Array.isArray(b)) return b === undefined ? a : b;
  const out = { ...a };
  for (const k of Object.keys(b)) out[k] = deepMerge(a?.[k], b[k]);
  return out;
}
export function loadConfig(proj) {
  return deepMerge(DEFAULT_CONFIG, readJson(path.join(proj, '.h-stack', 'config.json'), {}));
}

// ---------- output (HS-012) ----------
export function refusal(rule, fact, action) {
  return `Blocked by ${rule}: ${fact}. To proceed: ${action}.`;
}
export function clip(text, maxLines = 10, proj = null, name = 'output') {
  const lines = String(text).split('\n');
  if (lines.length <= maxLines) return text;
  const ref = proj ? logFull(proj, name, text) : null;
  const head = lines.slice(0, Math.max(1, maxLines - 4));
  const tail = lines.slice(-2);
  return [...head, `… ${lines.length - head.length - tail.length} lines omitted${ref ? ` (full: ${ref})` : ''}`, ...tail].join('\n');
}
export function emit(obj) {
  if (obj === null || obj === undefined) return;
  process.stdout.write(JSON.stringify(obj) + '\n');
}
export function context(event, text) {
  if (!text) return null;
  return { hookSpecificOutput: { hookEventName: event, additionalContext: text } };
}
export function preDecision(decision, reason, extraContext) {
  // H-Stack gates never return allow (§6.3, §10.5).
  if (decision !== 'deny' && decision !== 'ask') throw new Error('gates return deny or ask only');
  const out = { hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: decision, permissionDecisionReason: reason } };
  if (extraContext) out.hookSpecificOutput.additionalContext = extraContext;
  return out;
}

// Run a hook body with the declared failure mode. Closed hooks print a deny on crash
// (onFailure: block in hooks.json is the second layer when the process cannot start).
export async function runHook(name, mode, body) {
  let input = {};
  try {
    input = readStdin();
    // HS-006 ablation: HSTACK_DISABLE=<hook names, comma-separated> or "all"/"hooks" turns hooks off for
    // a measurement run. It comes from Claude Code's own environment, which the agent's shell cannot set.
    const off = String(process.env.HSTACK_DISABLE || '').split(',').map((x) => x.trim()).filter(Boolean);
    if (off.includes('all') || off.includes('hooks') || off.includes(name)) { process.exitCode = 0; return; }
    if (process.env.HSTACK_TEST_CRASH === name) throw new Error('test crash');
    const out = await body(input);
    emit(out);
    process.exitCode = 0;
  } catch (err) {
    try {
      const proj = projectDir(input);
      appendLine(path.join(stateDir(proj), 'logs', 'hook-errors.jsonl'), { hook: name, error: String(err && err.stack || err).slice(0, 1500) }, proj);
    } catch { /* ignore */ }
    if (mode === 'closed' && input.hook_event_name === 'PreToolUse') {
      emit(preDecision('deny', refusal(`h-stack:${name}`, 'the guard crashed, so the action was not checked', 'report this to the user; the error is in .h-stack/logs/hook-errors.jsonl')));
      process.exitCode = 0;
    } else {
      process.exitCode = mode === 'closed' ? 2 : 0;
    }
  }
}

// ---------- git ----------
export function git(proj, args, opts = {}) {
  try {
    return execFileSync('git', ['-C', proj, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], timeout: opts.timeout || 3000, maxBuffer: 16 * 1024 * 1024 });
  } catch { return null; }
}
// Tree fingerprint: HEAD + content hash of every changed or untracked path.
export function treeHash(proj) {
  const head = (git(proj, ['rev-parse', 'HEAD']) || 'nohead').trim();
  const status = git(proj, ['status', '--porcelain=v1', '-z', '--untracked-files=all']);
  if (status === null) return 'nogit';
  const h = crypto.createHash('sha256').update(head);
  const entries = status.split('\0').filter(Boolean).sort();
  for (const e of entries) {
    const p = e.slice(3);
    h.update(e.slice(0, 3) + p);
    try {
      const st = fs.statSync(path.join(proj, p));
      if (st.isFile() && st.size < 8 * 1024 * 1024) h.update(fs.readFileSync(path.join(proj, p)));
    } catch { /* deleted */ }
  }
  return h.digest('hex').slice(0, 16);
}

// ---------- misc ----------
export function now() { return Date.now(); }
export function toPosix(p) { return String(p).split(path.sep).join('/'); }
export function relToProject(proj, p) {
  if (!p) return '';
  const abs = path.isAbsolute(p) ? p : path.join(proj, p);
  return toPosix(path.relative(proj, abs));
}
export function globToRegExp(glob) {
  let re = '';
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === '*') {
      if (glob[i + 1] === '*') { re += '.*'; i++; if (glob[i + 1] === '/') i++; }
      else re += '[^/]*';
    } else if (c === '?') re += '[^/]';
    else if (c === '{') { const end = glob.indexOf('}', i); re += '(' + glob.slice(i + 1, end).split(',').map((s) => s.replace(/[.+^$()|[\]\\]/g, '\\$&')).join('|') + ')'; i = end; }
    else re += c.replace(/[.+^$()|[\]\\]/g, '\\$&');
  }
  return new RegExp('^' + re + '$');
}
export function matchesAny(rel, globs) {
  return globs.some((g) => globToRegExp(g).test(rel));
}
