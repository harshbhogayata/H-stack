const assert = require('assert');
const { buildReport } = require('./report');
const rows = JSON.parse(buildReport([{ customer: 'a', amount: 2 }, { customer: 'b', amount: 3 }, { customer: 'a', amount: 5 }]));
assert.deepStrictEqual(rows, [{ customer: 'a', total: 7 }, { customer: 'b', total: 3 }]);
console.log('report test passed');
