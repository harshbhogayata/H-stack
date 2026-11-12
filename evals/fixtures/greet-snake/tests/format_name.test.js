const test = require('node:test');
const assert = require('node:assert/strict');
const { format_name } = require('../lib/format_name');

test('joins names', () => {
    assert.equal(format_name('Ada', 'Lovelace'), 'Ada Lovelace');
});
