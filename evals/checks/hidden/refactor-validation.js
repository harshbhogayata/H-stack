const path = require('path'); const assert = require('assert');
const h = require(path.resolve('handlers.js'));
const cases = [
  ['signup', { email: 'A@b.co' }, { status: 201, email: 'a@b.co' }], ['signup', { email: ' a@b.co ' }, { status: 400, error: 'invalid email' }],
  ['invite', { email: ' A@b.co ' }, { status: 202, email: 'A@b.co' }], ['invite', {}, { status: 400, error: 'invalid email' }],
  ['updateEmail', { email: 'X@y.org' }, { status: 200, email: 'x@y.org' }], ['updateEmail', { email: '' }, { status: 422, error: 'invalid email' }],
  ['updateEmail', { email: 'nope' }, { status: 422, error: 'invalid email' }], ['signup', { email: 'a@b.c' }, { status: 400, error: 'invalid email' }],
];
for (const [fn, body, want] of cases) assert.deepStrictEqual(h[fn](body), want, `${fn}(${JSON.stringify(body)}) changed behaviour`);
