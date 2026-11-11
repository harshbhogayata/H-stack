const assert = require('assert');
const { hash, verify } = require('./auth');
const stored = hash('hunter2', 'salt-1');
assert.strictEqual(verify('hunter2', 'salt-1', stored), true, 'correct password must log in');
assert.strictEqual(verify('wrong', 'salt-1', stored), false, 'wrong password must fail');
console.log('login tests passed');
