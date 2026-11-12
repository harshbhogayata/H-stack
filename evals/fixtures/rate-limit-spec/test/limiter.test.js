const test = require('node:test'); const assert = require('node:assert');
const { createLimiter } = require('../limiter');
test('starts full', () => { const a = createLimiter({ capacity: 2, refillPerSec: 1 }); assert.ok(a('k', 0)); assert.ok(a('k', 0)); assert.ok(!a('k', 0)); });
