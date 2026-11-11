import test from 'node:test';
import assert from 'node:assert/strict';
import { listInvoices } from '../src/invoices.js';
test('lists invoices', () => { assert.equal(listInvoices().length, 2); });
