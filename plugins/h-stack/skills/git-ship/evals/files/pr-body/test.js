const a = require('assert');
const { createLimiter } = require('./rate');
let t = 0; const allow = createLimiter(2, 1000, () => t);
a.strictEqual(allow('k'), true); a.strictEqual(allow('k'), true); a.strictEqual(allow('k'), false);
t = 1001; a.strictEqual(allow('k'), true);
console.log('rate tests passed (4 assertions)');
