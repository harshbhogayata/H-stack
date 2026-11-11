const test = require('node:test');
const assert = require('node:assert/strict');
const { listItems } = require('../lib/api');

test('page 1 starts with the first item', () => {
  const res = listItems({ page: '1', size: '10' });
  assert.equal(res.items.length, 10);
  assert.equal(res.items[0].id, 1);
});

test('the last page holds the remainder', () => {
  const res = listItems({ page: '24', size: '10' });
  assert.deepEqual(res.items.map((i) => i.id), [231, 232, 233, 234, 235, 236, 237]);
});
