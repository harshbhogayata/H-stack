const test = require('node:test'); const assert = require('node:assert');
const { listItems } = require('../lib/api');
test('page 1 starts with item 1', () => { assert.strictEqual(listItems(1)[0].id, 1); });
