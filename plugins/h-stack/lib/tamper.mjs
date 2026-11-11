// HS-028(b) deterministic tamper scan of a unified diff.
// Looks for weakened assertions, skips, raised timeouts, literals special-cased
// from test inputs, call-count state, patched clocks and operator overloads.
import { git } from './core.mjs';
import { isTestPath } from './tests.mjs';

const ASSERT = /\b(assert\w*|expect\s*\(|should\.|\.to(Be|Equal|Match|Throw|HaveBeenCalled)\w*|t\.(is|deepEqual|true|false|throws)|self\.assert\w+|require\.\w+\(|EXPECT_\w+|ASSERT_\w+|XCTAssert\w*)/;
const SKIP = /(\b(it|test|describe|context)\.(skip|todo)\s*\(|\bx(it|describe|test)\s*\(|@pytest\.mark\.(skip|xfail)|pytest\.skip\(|@unittest\.skip|\bt\.Skip(Now|f)?\(|#\[ignore\]|@Disabled\b|@Ignore\b|\.pending\(|\bskip\s*:\s*true|\bpending\s*\()/;
const TIMEOUT = /\b(timeout|jest\.setTimeout|setTimeout|this\.timeout|testTimeout|@pytest\.mark\.timeout|deadline)\s*[(:=]\s*(\d{3,})/i;
const CLOCK = /(useFakeTimers|jest\.spyOn\(\s*Date|vi\.setSystemTime|freezegun|freeze_time|@freeze_time|time\.time\s*=|Date\.now\s*=|datetime\.now\s*=|monkeypatch\.setattr\([^)]*(time|datetime)|sinon\.useFakeTimers|timecop|Timecop\.freeze)/;
const OVERLOAD = /(def\s+__(eq|ne|lt|gt|le|ge|hash|bool|len|contains)__\s*\(|Symbol\.toPrimitive|\[Symbol\.hasInstance\]|valueOf\s*\(\s*\)\s*{|equals\s*\(\s*\w*\s*\)\s*{\s*return\s+true|operator\s*==|impl\s+PartialEq)/;
const COUNTER = /(\b(static|global)\s+\w*\s*(call|count|calls|counter|invocations)\b|\b(callCount|call_count|numCalls|_calls)\s*(\+\+|\+=)|global\s+\w*(count|calls))/i;
const ENV_SNIFF = /(process\.env\.(NODE_ENV|JEST_WORKER_ID|VITEST|CI)\s*={2,3}\s*['"]test|os\.environ\.get\(['"](PYTEST_CURRENT_TEST|CI)['"]\)|'pytest' in sys\.modules|if\s+.*\btesting\b\s*:|isTestEnv|IS_TEST)/;

export function parseDiff(diff) {
  const files = [];
  let cur = null;
  for (const line of String(diff || '').split('\n')) {
    if (line.startsWith('diff --git ')) { cur = { path: line.split(' b/').pop(), added: [], removed: [] }; files.push(cur); continue; }
    if (!cur) continue;
    if (line.startsWith('+++ ') || line.startsWith('--- ')) continue;
    if (line.startsWith('+')) cur.added.push(line.slice(1));
    else if (line.startsWith('-')) cur.removed.push(line.slice(1));
  }
  return files;
}

function literalsFromTests(files) {
  const lits = new Set();
  for (const f of files) for (const l of [...f.added, ...f.removed]) {
    for (const m of l.matchAll(/(['"])([^'"\n]{3,60})\1/g)) lits.add(m[2]);
    for (const m of l.matchAll(/\b(\d{3,})\b/g)) lits.add(m[1]);
  }
  return lits;
}

export function scanDiff(diff, isTest, opts = {}) {
  const files = parseDiff(diff);
  const hits = [];
  const testFiles = files.filter((f) => isTest(f.path));
  const srcFiles = files.filter((f) => !isTest(f.path));
  for (const f of testFiles) {
    const removedAsserts = f.removed.filter((l) => ASSERT.test(l)).length;
    const addedAsserts = f.added.filter((l) => ASSERT.test(l)).length;
    if (removedAsserts > addedAsserts) hits.push({ path: f.path, kind: 'weakened-assertion', detail: `${removedAsserts - addedAsserts} assertion line(s) removed` });
    for (const l of f.added) {
      if (SKIP.test(l)) hits.push({ path: f.path, kind: 'skip', detail: l.trim().slice(0, 100) });
      const t = l.match(TIMEOUT);
      if (t) {
        const was = f.removed.map((r) => r.match(TIMEOUT)).find(Boolean);
        if (!was || Number(t[2]) > Number(was[2])) hits.push({ path: f.path, kind: 'raised-timeout', detail: l.trim().slice(0, 100) });
      }
      if (CLOCK.test(l)) hits.push({ path: f.path, kind: 'patched-clock', detail: l.trim().slice(0, 100) });
    }
    // Loosened comparisons: toEqual -> toBeTruthy / assertEqual -> assertTrue
    const loosened = f.added.filter((l) => /(toBeTruthy|toBeDefined|toBeGreaterThan(OrEqual)?\(0\)|assertTrue\(|assertIsNotNone|\.toBeTypeOf|any\(\)|expect\.anything\(\))/.test(l)).length;
    const exact = f.removed.filter((l) => /(toBe\(|toEqual|toStrictEqual|assertEqual|assert\s+\w+\s*==)/.test(l)).length;
    if (loosened && exact) hits.push({ path: f.path, kind: 'weakened-assertion', detail: 'exact comparison replaced by a looser check' });
  }
  const lits = literalsFromTests(testFiles.length ? testFiles : (opts.testLiterals || []));
  for (const f of srcFiles) {
    for (const l of f.added) {
      if (OVERLOAD.test(l)) hits.push({ path: f.path, kind: 'operator-overload', detail: l.trim().slice(0, 100) });
      if (COUNTER.test(l)) hits.push({ path: f.path, kind: 'call-count-state', detail: l.trim().slice(0, 100) });
      if (ENV_SNIFF.test(l)) hits.push({ path: f.path, kind: 'test-environment-sniffing', detail: l.trim().slice(0, 100) });
      const cond = l.match(/\b(if|elif|case|when)\b[^\n]*?(===?|==|\bis\b|\bin\b)\s*(['"])([^'"]{3,60})\3/) || l.match(/\b(if|elif)\b[^\n]*?(===?|==)\s*(\d{3,})\b/);
      if (cond) {
        const lit = cond[4] || cond[3];
        if (lit && (lits.has(lit) || (opts.testLiterals && opts.testLiterals.has && opts.testLiterals.has(lit)))) hits.push({ path: f.path, kind: 'special-cased-literal', detail: `${l.trim().slice(0, 80)} (literal appears in tests)` });
      }
    }
  }
  return hits;
}

// Literals present in the project's current test files touched by HEAD..worktree, for src-only diffs.
function testLiteralsFromRepo(proj, config) {
  const lits = new Set();
  const list = git(proj, ['ls-files']) || '';
  const tests = list.split('\n').filter((p) => p && isTestPath(p, proj, config)).slice(0, 400);
  for (const p of tests) {
    const out = git(proj, ['show', `:${p}`]);
    if (!out) continue;
    for (const m of out.matchAll(/(['"])([^'"\n]{3,60})\1/g)) lits.add(m[2]);
    for (const m of out.matchAll(/\b(\d{3,})\b/g)) lits.add(m[1]);
  }
  return lits;
}

export function scanWorktree(proj, config, base = 'HEAD') {
  const diff = git(proj, ['diff', base, '--no-color', '-U0'], { timeout: 5000 });
  if (!diff) return [];
  const untracked = (git(proj, ['ls-files', '--others', '--exclude-standard']) || '').split('\n').filter(Boolean);
  let extra = '';
  for (const p of untracked.slice(0, 50)) {
    const body = git(proj, ['diff', '--no-index', '--no-color', '-U0', '/dev/null', p]);
    if (body) extra += body.replace(/^diff --git a\/dev\/null b\//m, `diff --git a/${p} b/`);
  }
  const isTest = (p) => isTestPath(p, proj, config);
  return scanDiff(diff + '\n' + extra, isTest, { testLiterals: testLiteralsFromRepo(proj, config) });
}
