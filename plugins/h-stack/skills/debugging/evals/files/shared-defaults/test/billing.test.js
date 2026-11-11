const test = require('node:test');
const assert = require('node:assert/strict');
const { formatTotal, refundTotal } = require('../lib/money');
const { createCustomer } = require('../lib/customers');

test('formats an invoice total', () => {
  assert.equal(formatTotal(1230), '12.30 EUR');
});

test('formats a total in a requested currency', () => {
  assert.equal(formatTotal(999, { currency: 'GBP' }), '9.99 GBP');
});

test('creates a customer with their own preferences', () => {
  const c = createCustomer({ id: 'c1', name: 'Ada', prefs: { currency: 'USD' } });
  assert.equal(c.prefs.currency, 'USD');
  assert.equal(c.prefs.precision, 2);
});

test('formats a refund', () => {
  assert.equal(refundTotal([{ cents: 500 }, { cents: 250 }]), '-7.50 EUR');
});
