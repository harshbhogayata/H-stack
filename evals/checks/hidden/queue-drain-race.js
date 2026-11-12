const path = require('path'); const assert = require('assert');
const { createQueue } = require(path.resolve('lib/queue.js'));
(async () => {
  const done = []; const q = createQueue((n) => new Promise((r) => setTimeout(() => { done.push(n); r(); }, 40)));
  q.push(1); q.push(2); await q.drain(); assert.strictEqual(done.length, 2, 'drain returns before jobs finish');
  const q2 = createQueue((n) => (n === 2 ? Promise.reject(new Error('boom')) : Promise.resolve()));
  q2.push(1); q2.push(2); q2.push(3); const r = await q2.drain(); assert.ok(r === 3 || (r && typeof r === 'object'), 'drain should still settle when a job fails');
})().catch((e) => { console.error(e.message); process.exit(1); });
