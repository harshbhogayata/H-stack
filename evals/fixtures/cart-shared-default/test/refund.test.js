const test = require('node:test'); const assert = require('node:assert');
require('./cart.test.js');
const { refund } = require('../lib/cart');
test('refunds use the shop currency', () => { assert.deepStrictEqual(refund(5), { amount: -5, currency: 'EUR' }); });
