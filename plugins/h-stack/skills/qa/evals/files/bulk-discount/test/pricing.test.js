const test = require('node:test');
const assert = require('node:assert/strict');
const { discountRate, lineTotal } = require('../pricing');

test('small orders pay full price', () => {
  assert.equal(discountRate(5), 0);
});

test('medium orders get 10%', () => {
  assert.equal(discountRate(20), 0.1);
});

test('large orders get 20%', () => {
  assert.equal(discountRate(100), 0.2);
});

test('line total applies the discount', () => {
  assert.equal(lineTotal(250, 20), 4500);
});

test('rejects non-integer quantities', () => {
  assert.throws(() => discountRate(2.5), RangeError);
});
