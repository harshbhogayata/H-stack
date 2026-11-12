const path = require('path'); const assert = require('assert');
const cart = require(path.resolve('lib/cart.js')); const { getDefaults } = require(path.resolve('lib/settings.js'));
cart.createCart({ name: 'x', prefs: { currency: 'GBP', taxRate: 0 } });
assert.strictEqual(getDefaults().currency, 'EUR', 'createCart still mutates the shared defaults');
assert.strictEqual(getDefaults().taxRate, 0.2);
assert.deepStrictEqual(cart.refund(3), { amount: -3, currency: 'EUR' });
