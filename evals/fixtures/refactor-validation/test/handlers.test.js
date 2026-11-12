const test = require('node:test'); const assert = require('node:assert');
const h = require('../handlers');
test('signup accepts a valid email', () => { assert.strictEqual(h.signup({ email: 'A@b.co' }).status, 201); });
