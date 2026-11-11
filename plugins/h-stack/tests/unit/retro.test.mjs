import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pruneRows, soloBoundary, effortFor, toolCounts } from '../../lib/retro.mjs';

test('pruneRows drops rows older than 90 days', () => {
  const now = Date.UTC(2026, 10, 11);
  const rows = [{ ts: now - 91 * 864e5 }, { ts: now - 89 * 864e5 }, { other: 1 }];
  assert.equal(pruneRows(rows, now).length, 2);
});

test('soloBoundary counts corrected turns as failures and sets effort', () => {
  const rows = [];
  for (let i = 0; i < 6; i++) rows.push({ session: 's', ts: i * 2, picked: ['h-stack:tdd'], size: 'light' }, { session: 's', ts: i * 2 + 1, size: 'direct', correction_of_previous: i < 3 ? ['h-stack:tdd'] : null });
  const s = soloBoundary(rows)['h-stack:tdd'];
  assert.equal(s.runs, 6); assert.equal(s.passed, 3); assert.equal(s.verify, 'full');
  assert.equal(effortFor({ runs: 2, pass_rate: 1 }), 'medium');
  assert.equal(effortFor({ runs: 10, pass_rate: 0.95 }), 'receipts');
});

test('toolCounts sorts by use', () => {
  assert.deepEqual(Object.keys(toolCounts([{ tool: 'Read' }, { tool: 'Bash' }, { tool: 'Bash' }])), ['Bash', 'Read']);
});

import { parseGitLog, gitSignals, userEditCandidates } from '../../lib/retro.mjs';
test('gitSignals counts reverts, rework and lead time', () => {
  const now = Date.UTC(2026, 10, 11);
  const log = [3, 2, 1].map((d) => `\x1e${'abc' + d}\x1f${(now - d * 36e5) / 1000}\x1f${d === 1 ? 'Revert "x"' : 'change ' + d}\na.js\n`).join('');
  const commits = parseGitLog(log);
  assert.equal(commits.length, 3);
  const g = gitSignals(commits, [{ ts: now - 4 * 36e5, picked: ['h-stack:tdd'] }], now);
  assert.equal(g.reverts, 1); assert.equal(g.rework[0].file, 'a.js'); assert.equal(g.median_minutes_request_to_commit, 60);
});
test('userEditCandidates finds quiet commits on files Claude edited', () => {
  const c = [{ sha: 'f'.repeat(40), ts: 10 * 36e5, subject: 'tweak', files: ['a.js', 'b.js'] }];
  assert.deepEqual(userEditCandidates([{ path: 'a.js', ts: 1 }], c, []).map((x) => x.file), ['a.js']);
  assert.equal(userEditCandidates([{ path: 'a.js', ts: 1 }], c, [{ ts: 10 * 36e5 - 60000 }]).length, 0);
});
