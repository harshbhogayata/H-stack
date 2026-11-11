import test from 'node:test';
import assert from 'node:assert/strict';
import { scanDiff } from '../../lib/tamper.mjs';

const isTest = (p) => /test/.test(p);
const diff = (file, removed, added) => `diff --git a/${file} b/${file}\n--- a/${file}\n+++ b/${file}\n@@ -1 +1 @@\n${removed.map((l) => '-' + l).join('\n')}\n${added.map((l) => '+' + l).join('\n')}\n`;
test('detects skips, weakened asserts, timeouts, clocks', () => {
  const kinds = (d) => scanDiff(d, isTest).map((h) => h.kind);
  assert.ok(kinds(diff('tests/a.test.js', ["it('x', () => {"], ["it.skip('x', () => {"])).includes('skip'));
  assert.ok(kinds(diff('tests/a.test.js', ['expect(total).toBe(10.3)'], [])).includes('weakened-assertion'));
  assert.ok(kinds(diff('tests/a.test.js', ['expect(total).toBe(10.3)'], ['expect(total).toBeTruthy()'])).includes('weakened-assertion'));
  assert.ok(kinds(diff('tests/a.test.js', ['jest.setTimeout(5000)'], ['jest.setTimeout(60000)'])).includes('raised-timeout'));
  assert.ok(kinds(diff('tests/a.test.js', [], ['jest.useFakeTimers()'])).includes('patched-clock'));
});
test('detects special-cased literals and overloads in source', () => {
  const d = diff('tests/inv.test.js', [], ["expect(fmt('2026-01-31')).toBe('Jan 31')"]) + diff('src/inv.js', [], ["if (input === '2026-01-31') return 'Jan 31';", 'def __eq__(self, other): return True']);
  const k = scanDiff(d, isTest).map((h) => h.kind);
  assert.ok(k.includes('special-cased-literal'));
  assert.ok(k.includes('operator-overload'));
});
test('clean diff passes', () => {
  assert.deepEqual(scanDiff(diff('src/a.js', ['return a+b'], ['return a + b']), isTest), []);
  assert.deepEqual(scanDiff(diff('tests/a.test.js', [], ["it('new case', () => { expect(f(2)).toBe(4); });"]), isTest), []);
});
