const test = require('node:test');
const assert = require('node:assert/strict');
const { dueDate } = require('../lib/invoice');

test('net30 adds thirty days', () => {
  assert.equal(dueDate({ issued: '2026-03-01', terms: 'net30' }), '2026-03-31');
});

test('net15 crosses a month boundary', () => {
  assert.equal(dueDate({ issued: '2026-01-20', terms: 'net15' }), '2026-02-04');
});

test('due on receipt is the issue date', () => {
  assert.equal(dueDate({ issued: '2026-05-12', terms: 'due_on_receipt' }), '2026-05-12');
});

test('unknown terms are rejected', () => {
  assert.throws(() => dueDate({ issued: '2026-05-12', terms: 'net45' }), /unknown payment terms/);
});
