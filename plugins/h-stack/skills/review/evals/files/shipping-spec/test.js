const assert = require('assert');
const { totals } = require('./checkout');

assert.deepStrictEqual(totals([{ price: 1200, qty: 2 }]), { subtotal: 2400, discount: 0, shipping: 495, total: 2895 });
assert.deepStrictEqual(totals([{ price: 2500, qty: 2 }]), { subtotal: 5000, discount: 0, shipping: 0, total: 5000 });
assert.deepStrictEqual(totals([{ price: 1999, qty: 1 }], 'spring10'), { subtotal: 1999, discount: 200, shipping: 495, total: 2294 });
assert.deepStrictEqual(totals([{ price: 1000, qty: 1 }], 'NOPE'), { subtotal: 1000, discount: 0, shipping: 495, total: 1495 });
console.log('checkout tests passed');
