const test = require('node:test'); const assert = require('node:assert');
const { createQueue } = require('../lib/queue');
test('drain waits for every job', async () => {
  const done = [];
  const q = createQueue((n) => new Promise((r) => setTimeout(() => { done.push(n); r(); }, Math.random() * 30)));
  for (let i = 0; i < 5; i++) q.push(i);
  await new Promise((r) => setTimeout(r, 15));
  await q.drain();
  assert.strictEqual(done.length, 5);
});
