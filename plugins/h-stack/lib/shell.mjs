// Minimal shell command parser for gates (HS-030, HS-031, HS-028, HS-034).
// Splits on ; && || | & and newlines, tokenises with quotes, unwraps
// bash -c / sh -c / env / sudo / xargs / nohup / time / command / exec / nice.
// Also yields $(...) and `...` substitutions as separate commands.

export function tokenize(src) {
  const tokens = [];
  let cur = '';
  let has = false;
  let i = 0;
  const push = () => { if (has) tokens.push(cur); cur = ''; has = false; };
  while (i < src.length) {
    const c = src[i];
    if (c === "'") {
      const end = src.indexOf("'", i + 1);
      cur += end < 0 ? src.slice(i + 1) : src.slice(i + 1, end);
      has = true; i = end < 0 ? src.length : end + 1; continue;
    }
    if (c === '"') {
      let j = i + 1;
      while (j < src.length && src[j] !== '"') { if (src[j] === '\\' && j + 1 < src.length) { cur += src[j + 1]; j += 2; continue; } cur += src[j]; j++; }
      has = true; i = j + 1; continue;
    }
    if (c === '\\' && i + 1 < src.length) { cur += src[i + 1]; has = true; i += 2; continue; }
    if (/\s/.test(c)) { push(); i++; continue; }
    if (c === '>' || c === '<') {
      push();
      let op = c;
      if (src[i + 1] === '>' || src[i + 1] === '&') { op += src[i + 1]; i++; }
      tokens.push({ redirect: op });
      i++; continue;
    }
    cur += c; has = true; i++;
  }
  push();
  return tokens;
}

// Split top-level command list, respecting quotes and $( ) nesting.
export function splitCommands(src) {
  const parts = [];
  const subs = [];
  let cur = '';
  let q = null;
  let depth = 0;
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (q) {
      cur += c;
      if (c === '\\' && q === '"' && i + 1 < src.length) { cur += src[++i]; continue; }
      if (c === q) q = null;
      continue;
    }
    if (c === "'" || c === '"') { q = c; cur += c; continue; }
    if (c === '$' && src[i + 1] === '(') {
      let d = 1; let j = i + 2; let inner = '';
      while (j < src.length && d > 0) { if (src[j] === '(') d++; else if (src[j] === ')') d--; if (d > 0) inner += src[j]; j++; }
      subs.push(inner); cur += '$(…)'; i = j - 1; continue;
    }
    if (c === '`') {
      const end = src.indexOf('`', i + 1);
      subs.push(end < 0 ? src.slice(i + 1) : src.slice(i + 1, end)); cur += '`…`'; i = end < 0 ? src.length : end; continue;
    }
    if (depth === 0 && (c === ';' || c === '\n' || c === '|' || c === '&')) {
      if (cur.trim()) parts.push(cur.trim());
      cur = '';
      if ((c === '|' || c === '&') && src[i + 1] === c) i++;
      continue;
    }
    cur += c;
  }
  if (cur.trim()) parts.push(cur.trim());
  return { parts, subs };
}

const WRAPPERS = new Set(['sudo', 'doas', 'nohup', 'time', 'command', 'exec', 'nice', 'ionice', 'stdbuf', 'timeout', 'caffeinate', 'watch']);

function unwrap(tokens, depth) {
  let t = tokens.filter((x) => typeof x === 'string');
  const redirects = [];
  for (let i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] === 'object' && tokens[i].redirect) {
      const target = tokens[i + 1];
      if (typeof target === 'string') redirects.push({ op: tokens[i].redirect, target });
    }
  }
  // drop redirect targets from argv
  const redirectTargets = new Set(redirects.map((r) => r.target));
  t = [];
  for (let i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] === 'object') { i++; continue; }
    t.push(tokens[i]);
  }
  void redirectTargets;
  // leading VAR=value assignments
  const env = {};
  while (t.length && /^[A-Za-z_][A-Za-z0-9_]*=/.test(t[0])) { const [k, ...v] = t.shift().split('='); env[k] = v.join('='); }
  if (!t.length) return [{ argv: [], env, redirects }];
  const head = t[0].split('/').pop();
  if (head === 'env') {
    t.shift();
    while (t.length && (t[0].startsWith('-') || /^[A-Za-z_][A-Za-z0-9_]*=/.test(t[0]))) { const x = t.shift(); if (x.includes('=')) { const [k, ...v] = x.split('='); env[k] = v.join('='); } }
    return depth > 6 ? [] : unwrap(t, depth + 1).map((c) => ({ ...c, env: { ...env, ...c.env }, redirects: [...redirects, ...c.redirects] }));
  }
  if (WRAPPERS.has(head)) {
    t.shift();
    while (t.length && t[0].startsWith('-')) { const f = t.shift(); if (/^-(u|g|n|p|s|k)$/.test(f) && t.length) t.shift(); }
    if (head === 'timeout' && t.length && /^\d/.test(t[0])) t.shift();
    return depth > 6 ? [] : unwrap(t, depth + 1).map((c) => ({ ...c, redirects: [...redirects, ...c.redirects] }));
  }
  if (head === 'xargs') {
    t.shift();
    while (t.length && t[0].startsWith('-')) { const f = t.shift(); if (/^-(I|n|P|L|d|E|s)$/.test(f) && t.length) t.shift(); }
    return depth > 6 ? [] : unwrap(t, depth + 1);
  }
  if (['bash', 'sh', 'zsh', 'dash', 'ksh'].includes(head)) {
    const ci = t.findIndex((x) => /^-[a-z]*c[a-z]*$/.test(x));
    if (ci > 0 && t[ci + 1] !== undefined) return depth > 6 ? [] : parseCommandsInner(t[ci + 1], depth + 1);
  }
  if (head === 'eval' && t.length > 1) return depth > 6 ? [] : parseCommandsInner(t.slice(1).join(' '), depth + 1);
  return [{ argv: t, env, redirects }];
}

function quotedSubs(arg) {
  const out = [];
  for (let i = arg.indexOf('$('); i >= 0; i = arg.indexOf('$(', i + 2)) {
    let d = 0;
    for (let j = i + 1; j < arg.length; j++) { if (arg[j] === '(') d++; else if (arg[j] === ')' && --d === 0) { out.push(arg.slice(i + 2, j)); break; } }
  }
  for (const m of arg.matchAll(/`([^`]+)`/g)) out.push(m[1]);
  return out;
}

function parseCommandsInner(src, depth) {
  const { parts, subs } = splitCommands(String(src || ''));
  const out = [];
  for (const p of parts) out.push(...unwrap(tokenize(p), depth));
  for (const s of subs) out.push(...parseCommandsInner(s, depth + 1));
  // Substitutions that survived inside double quotes ("$(gh auth token)") are commands too.
  if (depth < 6) for (const c of [...out]) for (const a of c.argv) for (const inner of quotedSubs(a)) out.push(...parseCommandsInner(inner, depth + 1));
  return out.filter((c) => c.argv.length || c.redirects.length);
}

export function parseCommands(src) {
  return parseCommandsInner(src, 0);
}

export function exe(cmd) {
  return (cmd.argv[0] || '').split('/').pop();
}

// Global options that take a separate value, per tool (self-audit F1/F2). `git -C . push` must
// classify the same as `git push`, so the options before the subcommand move after it.
const GLOBAL_VALUE_FLAGS = {
  git: ['-C', '-c', '--git-dir', '--work-tree', '--namespace', '--exec-path', '--super-prefix', '--config-env'],
  gh: ['-R', '--repo', '--hostname'],
  kubectl: ['--context', '-n', '--namespace', '--kubeconfig', '-s', '--server', '--cluster', '--user', '--token', '--as', '-l'],
  helm: ['-n', '--namespace', '--kube-context', '--kubeconfig', '--registry-config', '--repository-config'],
  terraform: [], tofu: [], pulumi: ['-C', '--cwd', '-s', '--stack'],
  npm: ['--prefix', '-C', '--workspace', '-w', '--registry', '--userconfig', '--cache'], pnpm: ['-C', '--dir', '--filter', '-F', '--workspace-dir'],
  yarn: ['--cwd'], bun: ['--cwd', '-c', '--config'], uv: ['--directory', '--project', '--python', '-p', '--config-file', '--cache-dir'],
  poetry: ['-C', '--directory', '-P', '--project'], cargo: ['-C', '--config', '--manifest-path', '-Z'], docker: ['-H', '--host', '-c', '--context', '--config', '-l', '--log-level'],
  aws: ['--profile', '--region', '--endpoint-url', '--output'], gcloud: ['--project', '--account', '--configuration'], az: ['--subscription'],
  wrangler: ['-c', '--config', '-e', '--env'], vercel: ['--scope', '--token', '-t', '--cwd'], fly: ['-a', '--app', '-c', '--config'], flyctl: ['-a', '--app', '-c', '--config'],
  gem: [], pip: [], pip3: [], go: [], twine: [], heroku: ['-a', '--app'], firebase: ['--project', '-P'],
};
export function normaliseArgv(argv) {
  const name = (argv[0] || '').split('/').pop();
  const vf = GLOBAL_VALUE_FLAGS[name];
  if (!vf) return argv;
  const globals = [];
  let i = 1;
  while (i < argv.length && argv[i].startsWith('-') && argv[i] !== '--') {
    const f = argv[i];
    globals.push(f);
    if (vf.includes(f) && !f.includes('=')) { if (i + 1 < argv.length) globals.push(argv[i + 1]); i += 2; } else i += 1;
  }
  if (!globals.length) return argv;
  return [argv[0], ...argv.slice(i), ...globals];
}
