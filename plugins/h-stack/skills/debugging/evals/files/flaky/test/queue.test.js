const test = require('node:test');
const assert = require('node:assert/strict');
const { Queue } = require('../src/queue');

test('processes all jobs', async () => {
  const q = new Queue();
  q.push('a'); q.push('b'); q.push('c');
  await new Promise((r) => setTimeout(r, 25));
  assert.equal(q.done.length, 3);
});
