const assert = require('assert');
const { loadConfig } = require('../src/config');
assert.strictEqual(loadConfig().port, 8080);
console.log('config test passed');
