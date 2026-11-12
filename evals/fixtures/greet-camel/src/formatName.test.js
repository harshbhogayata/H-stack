import test from 'node:test';
import assert from 'node:assert/strict';
import { formatName } from './formatName.js';

test('joins names', () => {
  assert.equal(formatName('Ada', 'Lovelace'), 'Ada Lovelace');
});
