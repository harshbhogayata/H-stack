const path = require('path'); const assert = require('assert');
const api = require(path.resolve('lib/api.js'));
assert.deepStrictEqual(api.listItems(1).map((x) => x.id), [1,2,3,4,5,6,7,8,9,10]);
assert.deepStrictEqual(api.listItems(4).map((x) => x.id), [31,32,33,34,35,36,37]);
assert.strictEqual(api.exportAll().length, 37, 'exportAll lost items');
assert.deepStrictEqual(api.exportAll().map((x) => x.id), api.ITEMS.map((x) => x.id));
