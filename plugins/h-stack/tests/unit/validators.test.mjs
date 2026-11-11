import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { validateLessonText } from '../../lib/lessons.mjs';
import { validateFindings, extractJson } from '../../lib/findings.mjs';
import { parseYaml } from '../../lib/yaml.mjs';

const FIX = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'fixtures', 'lessons');
test('lesson fixtures: good pass, bad fail with the expected reason', () => {
  for (const f of fs.readdirSync(FIX)) {
    const res = validateLessonText(fs.readFileSync(path.join(FIX, f), 'utf8'));
    if (f.startsWith('good-')) assert.ok(res.ok, `${f}: ${res.errors.join('; ')}`);
    else { assert.ok(!res.ok, `${f} should fail`); const want = f.replace(/^bad-|\.md$/g, ''); assert.ok(res.errors.some((e) => e.toLowerCase().includes(want.replace(/-/g, ' ').split(' ')[0])), `${f}: ${res.errors.join('; ')}`); }
  }
});
test('findings validator: truth checks and hostile inputs', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hs-find-'));
  fs.writeFileSync(path.join(dir, 'a.js'), 'const x = 1;\nfunction f() { return eval(input); }\n');
  const good = { findings: [{ id: 'F1', title: 'eval of input', severity: 'high', verdict: 'confirmed', file: 'a.js', line: 2, snippet: 'return eval(input);', evidence: 'input is user controlled' }], cleared: ['a.js:imports'] };
  assert.ok(validateFindings(good, dir).ok);
  const hostile = [
    null, 'string', { findings: 'x', cleared: [] }, { findings: [{ ...good.findings[0], file: '../../etc/passwd' }], cleared: [] },
    { findings: [{ ...good.findings[0], line: 99 }], cleared: [] }, { findings: [{ ...good.findings[0], snippet: 'not there' }], cleared: [] },
    { findings: [{ ...good.findings[0], verdict: 'maybe' }], cleared: [] }, { findings: [{ ...good.findings[0], line: -1 }], cleared: [] },
    { findings: Array(11).fill(good.findings[0]), cleared: [] }, { findings: [{ ...good.findings[0], file: 'missing.js' }], cleared: [] },
  ];
  for (const h of hostile) assert.ok(!validateFindings(h, dir).ok, JSON.stringify(h).slice(0, 60));
  assert.ok(validateFindings({ findings: [], cleared: ['one'] }, dir).shallow);
  assert.ok(!validateFindings({ findings: [], cleared: ['a', 'b', 'c'] }, dir).shallow);
  assert.deepEqual(extractJson('noise ```json\n{"a":1}\n``` more'), { a: 1 });
});
test('yaml subset', () => {
  assert.deepEqual(parseYaml('a: [1, "b"]\nc:\n  d: true\n  e:\n    - x\n    - y: 2\n'), { a: [1, 'b'], c: { d: true, e: ['x', { y: 2 }] } });
});
