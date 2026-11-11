const assert = require('assert');
const { add, mul } = require('./math');
assert.strictEqual(add(2, 3), 5);
assert.strictEqual(add(-2, 3), 1);
assert.strictEqual(add(-2, -3), -5);
assert.strictEqual(mul(2, 3), 6);
console.log('4 assertions passed');
