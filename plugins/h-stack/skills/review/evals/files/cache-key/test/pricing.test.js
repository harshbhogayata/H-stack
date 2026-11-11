const test = require('node:test');
const assert = require('node:assert/strict');
const { quote } = require('../src/pricing');

test('quotes a USD cart without tax', () => {
  assert.deepEqual(quote([{ sku: 'TSHIRT-01', qty: 2 }, { sku: 'MUG-02' }]), { currency: 'USD', subtotal: 5200, tax: 0, total: 5200 });
});

test('adds VAT for EUR', () => {
  assert.deepEqual(quote([{ sku: 'CAP-03' }], 'EUR'), { currency: 'EUR', subtotal: 1400, tax: 280, total: 1680 });
});

test('rejects an unsupported currency', () => {
  assert.throws(() => quote([{ sku: 'MUG-02' }], 'JPY'), /unsupported currency/);
});
