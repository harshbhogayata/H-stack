// HS-031 dependency gate: a package passes only if it exists, is old enough,
// has real usage, and is not a near-miss of a popular name. Offline => ask.
// Registry lookups send only the package name. HSTACK_REGISTRY_FIXTURE (a JSON
// file) replaces the network in tests.
import fs from 'node:fs';
import path from 'node:path';
import { parseCommands, exe } from './shell.mjs';
import { stateDir, readJson, writeJsonAtomic } from './core.mjs';
import { PY_STDLIB, NODE_BUILTINS, TOP } from './deps-data.mjs';

export function lev(a, b) {
  if (a === b) return 0;
  const m = a.length; const n = b.length;
  if (Math.abs(m - n) > 2) return 3;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[n];
}

const stripVersion = (eco, spec) => {
  let s = String(spec).trim();
  if (eco === 'npm') { if (s.startsWith('@')) { const i = s.indexOf('@', 1); return i > 0 ? s.slice(0, i) : s; } return s.split('@')[0]; }
  if (eco === 'pypi') return s.split(/[<>=!~;\[ ]/)[0].toLowerCase();
  if (eco === 'go') return s.split('@')[0];
  if (eco === 'crates') return s.split('@')[0];
  return s.split(/[@:]/)[0];
};
const isLocalSpec = (s) => /^(\.|\/|~|file:|git\+|https?:|link:|workspace:|-)/.test(s) || s.includes('/') && s.endsWith('.tgz');

// Packages named by an install command.
export function installTargets(command) {
  const out = [];
  for (const c of parseCommands(command)) {
    const a = c.argv; const e = exe(c);
    const VALUE_FLAGS = new Set(['--features', '-F', '--registry', '--tag', '--target', '--git', '--branch', '--rev', '--path', '--vers', '--version', '--source', '--group', '-G', '--index', '--filter', '--workspace', '-w', '--save-prefix', '--python', '-p', '--package']);
    const args = (from) => { const r = []; const xs = a.slice(from); for (let k = 0; k < xs.length; k++) { if (VALUE_FLAGS.has(xs[k])) { k++; continue; } if (!xs[k].startsWith('-')) r.push(xs[k]); } return r; };
    let eco = null; let names = [];
    if (['npm', 'pnpm', 'yarn', 'bun', 'cnpm'].includes(e) && ['i', 'install', 'add'].includes(a[1])) { eco = 'npm'; names = args(2); }
    else if ((e === 'pip' || e === 'pip3' || (e === 'python' || e === 'python3') && a[1] === '-m' && a[2] === 'pip') && a.includes('install')) {
      eco = 'pypi';
      const i = a.indexOf('install');
      const rest = a.slice(i + 1);
      for (let k = 0; k < rest.length; k++) { if (['-r', '-c', '-e', '--requirement', '--constraint', '--editable', '-i', '--index-url', '--extra-index-url', '-t', '--target'].includes(rest[k])) { k++; continue; } if (!rest[k].startsWith('-')) names.push(rest[k]); }
    }
    else if (e === 'uv' && (a[1] === 'add' || (a[1] === 'pip' && a[2] === 'install'))) { eco = 'pypi'; names = args(a[1] === 'add' ? 2 : 3); }
    else if (e === 'poetry' && a[1] === 'add') { eco = 'pypi'; names = args(2); }
    else if (e === 'pipx' && a[1] === 'install') { eco = 'pypi'; names = args(2); }
    else if (e === 'cargo' && (a[1] === 'add' || a[1] === 'install')) { eco = 'crates'; names = args(2); }
    else if (e === 'go' && (a[1] === 'get' || a[1] === 'install')) { eco = 'go'; names = args(2).filter((x) => x.includes('.')); }
    else if (e === 'gem' && a[1] === 'install') { eco = 'rubygems'; names = args(2); }
    else if (e === 'bundle' && a[1] === 'add') { eco = 'rubygems'; names = args(2); }
    else if (e === 'composer' && a[1] === 'require') { eco = 'packagist'; names = args(2); }
    if (!eco) continue;
    for (const n of names) if (!isLocalSpec(n) && !/\.(txt|toml|cfg|lock)$/.test(n)) out.push({ eco, name: stripVersion(eco, n), latest: /@latest$/.test(n) });
  }
  return out;
}

// Dependencies added by a manifest edit (old text -> new text).
export function manifestAdds(file, oldText, newText) {
  const base = path.basename(file);
  const extract = (t) => {
    const s = String(t || '');
    if (base === 'package.json') {
      try { const j = JSON.parse(s); return Object.keys({ ...j.dependencies, ...j.devDependencies, ...j.peerDependencies, ...j.optionalDependencies }).map((n) => ({ eco: 'npm', name: n })); }
      catch { return [...s.matchAll(/"(@?[a-z0-9][\w.-]*(?:\/[\w.-]+)?)"\s*:\s*"[~^<>=*\d]/gi)].map((m) => ({ eco: 'npm', name: m[1] })); }
    }
    if (/^requirements.*\.txt$/.test(base)) return s.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#') && !l.startsWith('-')).map((l) => ({ eco: 'pypi', name: stripVersion('pypi', l) }));
    if (base === 'pyproject.toml') return [...s.matchAll(/^\s*"([A-Za-z0-9][\w.-]*)\s*[<>=!~;\[" ]/gm), ...s.matchAll(/^([A-Za-z0-9][\w.-]*)\s*=\s*["{]/gm)].map((m) => ({ eco: 'pypi', name: m[1].toLowerCase() })).filter((x) => !['python', 'name', 'version', 'description', 'requires-python', 'readme', 'license'].includes(x.name));
    if (base === 'Cargo.toml') { const sec = s.split(/^\[/m).filter((x) => /^(dev-|build-)?dependencies\]/.test(x)).join('\n'); return [...sec.matchAll(/^([A-Za-z0-9_-]+)\s*=/gm)].map((m) => ({ eco: 'crates', name: m[1] })); }
    if (base === 'go.mod') return [...s.matchAll(/^\s*(?:require\s+)?([a-z0-9.-]+\.[a-z]{2,}\/[^\s]+)\s+v/gm)].map((m) => ({ eco: 'go', name: m[1] }));
    if (base === 'Gemfile') return [...s.matchAll(/^\s*gem\s+["']([^"']+)["']/gm)].map((m) => ({ eco: 'rubygems', name: m[1] }));
    return [];
  };
  if (!['package.json', 'pyproject.toml', 'Cargo.toml', 'go.mod', 'Gemfile'].includes(base) && !/^requirements.*\.txt$/.test(base)) return [];
  const before = new Set(extract(oldText).map((x) => x.name));
  return extract(newText).filter((x) => !before.has(x.name));
}

// New imports of packages not declared in the project (JS and Python).
export function importAdds(proj, file, oldText, newText) {
  const ext = path.extname(file);
  const grab = (t) => {
    const s = String(t || '');
    if (/\.(m?[jt]sx?|cjs)$/.test(ext)) return [...s.matchAll(/(?:import\s+(?:[^'"]*?\sfrom\s+)?|require\(\s*|import\(\s*)['"]([^'"]+)['"]/g)].map((m) => m[1]);
    if (ext === '.py') return [...s.matchAll(/^\s*(?:from\s+([A-Za-z_][\w]*)[\w.]*\s+import|import\s+([A-Za-z_][\w]*))/gm)].map((m) => m[1] || m[2]);
    return [];
  };
  const before = new Set(grab(oldText));
  const added = grab(newText).filter((x) => !before.has(x));
  if (!added.length) return [];
  if (/\.(m?[jt]sx?|cjs)$/.test(ext)) {
    const pkg = readJson(path.join(proj, 'package.json'), null);
    if (!pkg) return [];
    const declared = new Set(Object.keys({ ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies, ...pkg.optionalDependencies }));
    return added.filter((s) => !s.startsWith('.') && !s.startsWith('/') && !s.startsWith('node:') && !s.startsWith('#') && !s.startsWith('~') && !s.startsWith('@/'))
      .map((s) => (s.startsWith('@') ? s.split('/').slice(0, 2).join('/') : s.split('/')[0]))
      .filter((n) => !NODE_BUILTINS.has(n) && !declared.has(n) && n !== pkg.name)
      .map((n) => ({ eco: 'npm', name: n }));
  }
  const manifests = ['requirements.txt', 'pyproject.toml', 'setup.py', 'setup.cfg', 'Pipfile'].map((f) => { try { return fs.readFileSync(path.join(proj, f), 'utf8').toLowerCase(); } catch { return ''; } }).join('\n');
  if (!manifests.trim()) return [];
  const local = (n) => fs.existsSync(path.join(proj, n)) || fs.existsSync(path.join(proj, `${n}.py`)) || fs.existsSync(path.join(proj, 'src', n)) || fs.existsSync(path.join(path.dirname(path.join(proj, file)), `${n}.py`));
  return added.filter((n) => !PY_STDLIB.has(n) && !local(n) && !manifests.includes(n.toLowerCase().replace(/_/g, '-')) && !manifests.includes(n.toLowerCase()))
    .map((n) => ({ eco: 'pypi', name: n.toLowerCase() }));
}

async function getJson(url, ms) {
  const res = await fetch(url, { signal: AbortSignal.timeout(ms), headers: { 'user-agent': 'h-stack-dependency-gate' } });
  if (res.status === 404) return { notFound: true };
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// Returns {exists, created (ms), weekly (number|null)} or throws when offline.
async function lookup(eco, name, ms) {
  const fixture = process.env.HSTACK_REGISTRY_FIXTURE;
  if (fixture) {
    const f = readJson(fixture, {});
    if (f.offline) throw new Error('offline (fixture)');
    const r = f[`${eco}:${name}`];
    return r ? { exists: true, created: r.created_days_ago != null ? Date.now() - r.created_days_ago * 864e5 : Date.parse(r.created), weekly: r.weekly ?? null } : { exists: false };
  }
  if (eco === 'npm') {
    const enc = name.startsWith('@') ? '@' + encodeURIComponent(name.slice(1)) : encodeURIComponent(name);
    const meta = await getJson(`https://registry.npmjs.org/${enc}`, ms);
    if (meta.notFound) return { exists: false };
    let weekly = null;
    try { const d = await getJson(`https://api.npmjs.org/downloads/point/last-week/${name}`, ms); weekly = d.downloads ?? null; } catch { /* usage unknown */ }
    return { exists: true, created: Date.parse(meta.time?.created), weekly };
  }
  if (eco === 'pypi') {
    const meta = await getJson(`https://pypi.org/pypi/${encodeURIComponent(name)}/json`, ms);
    if (meta.notFound) return { exists: false };
    const times = Object.values(meta.releases || {}).flat().map((f) => Date.parse(f.upload_time_iso_8601 || f.upload_time)).filter(Boolean);
    let weekly = null;
    try { const d = await getJson(`https://pypistats.org/api/packages/${encodeURIComponent(name)}/recent`, ms); weekly = d.data?.last_week ?? null; } catch { /* unknown */ }
    return { exists: true, created: times.length ? Math.min(...times) : NaN, weekly };
  }
  if (eco === 'crates') {
    const meta = await getJson(`https://crates.io/api/v1/crates/${encodeURIComponent(name)}`, ms);
    if (meta.notFound) return { exists: false };
    return { exists: true, created: Date.parse(meta.crate?.created_at), weekly: meta.crate?.recent_downloads != null ? Math.round(meta.crate.recent_downloads / 13) : null };
  }
  if (eco === 'go') {
    const meta = await getJson(`https://proxy.golang.org/${name.toLowerCase()}/@latest`, ms);
    if (meta.notFound) return { exists: false };
    return { exists: true, created: Date.parse(meta.Time), weekly: null };
  }
  if (eco === 'rubygems') {
    const meta = await getJson(`https://rubygems.org/api/v1/gems/${encodeURIComponent(name)}.json`, ms);
    if (meta.notFound) return { exists: false };
    return { exists: true, created: Date.parse(meta.created_at || meta.version_created_at), weekly: meta.downloads != null ? Math.round(meta.downloads / 520) : null };
  }
  throw new Error(`no registry lookup for ${eco}`);
}

export function nearMiss(eco, name) {
  const tops = TOP[eco] || [];
  if (tops.includes(name)) return null;
  const n = name.toLowerCase();
  for (const t of tops) {
    const d = lev(n, t.toLowerCase());
    if (d > 0 && d <= 2 && Math.min(n.length, t.length) >= 4) return t;
    if (n.replace(/[-_.]/g, '') === t.replace(/[-_.]/g, '') && n !== t) return t;
  }
  return null;
}

// Check a list of {eco,name}. Returns problems: [{eco,name,reason}].
export async function checkPackages(proj, pkgs, config) {
  const cfg = config.deps || {};
  const problems = [];
  if (!pkgs.length) return problems;
  const cacheFile = path.join(stateDir(proj), 'cache', 'deps.json');
  const cache = readJson(cacheFile, {});
  const now = Date.now();
  const ttl = (cfg.cache_days ?? 7) * 864e5;
  let dirty = false;
  await Promise.all(pkgs.map(async ({ eco, name, latest }) => {
    const key = `${eco}:${name}`;
    const near = nearMiss(eco, name);
    if (near) problems.push({ eco, name, reason: `within edit distance 2 of the popular package "${near}"` });
    if (latest) problems.push({ eco, name, reason: 'installs @latest, so the version is not pinned' });
    if (cfg.lookup === false) return;
    let info = cache[key] && now - cache[key].checked < ttl ? cache[key] : null;
    if (!info) {
      try { info = { ...(await lookup(eco, name, 1800)), checked: now }; cache[key] = info; dirty = true; }
      catch (e) { problems.push({ eco, name, reason: `registry unreachable (${String(e.message).slice(0, 60)}), so existence, age and usage are unchecked` }); return; }
    }
    if (!info.exists) { problems.push({ eco, name, reason: 'not found in the registry (possibly a hallucinated name)' }); return; }
    const ageDays = (now - info.created) / 864e5;
    if (Number.isFinite(ageDays) && ageDays < (cfg.min_age_days ?? 30)) problems.push({ eco, name, reason: `first published ${Math.round(ageDays)} days ago (minimum ${cfg.min_age_days ?? 30})` });
    if (info.weekly != null && info.weekly < (cfg.min_weekly_downloads ?? 50)) problems.push({ eco, name, reason: `about ${info.weekly} downloads a week (floor ${cfg.min_weekly_downloads ?? 50})` });
  }));
  if (dirty) { try { writeJsonAtomic(cacheFile, cache); } catch { /* ignore */ } }
  return problems.sort((a, b) => (a.name + a.reason).localeCompare(b.name + b.reason));
}
