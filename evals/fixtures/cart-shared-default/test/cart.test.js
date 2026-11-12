const test = require('node:test'); const assert = require('node:assert');
const { createCart, total } = require('../lib/cart');
test('US customer pays in USD', () => {
  const c = createCart({ name: 'ann', prefs: { currency: 'USD' } });
  c.items.push({ price: 10, qty: 2 });
  assert.deepStrictEqual(total(c), { amount: 24, currency: 'USD' });
});
