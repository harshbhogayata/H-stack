const assert = require('assert');
const { parseDuration } = require('./duration');

assert.strictEqual(parseDuration('1h30m'), 5400000);
assert.strictEqual(parseDuration('1.5s'), 1500);
assert.strictEqual(parseDuration('2m 10s'), 130000);
assert.strictEqual(parseDuration(' 45s '), 45000);
assert.throws(() => parseDuration(''), TypeError);
assert.throws(() => parseDuration('10x'), TypeError);
assert.throws(() => parseDuration(30), TypeError);
console.log('duration tests passed');
