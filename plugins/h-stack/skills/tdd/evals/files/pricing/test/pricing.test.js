import test from 'node:test';
import assert from 'node:assert/strict';
import { subtotal } from '../src/pricing.js';
test('subtotal multiplies price by quantity', () => {
  assert.equal(subtotal([{ priceCents: 250, qty: 2 }, { priceCents: 100, qty: 1 }]), 600);
});
