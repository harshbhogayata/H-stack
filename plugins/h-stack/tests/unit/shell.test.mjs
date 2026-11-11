import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCommands } from '../../lib/shell.mjs';

test('splits lists and pipes', () => {
  const c = parseCommands('npm test && git push origin main | tee log; echo done');
  assert.deepEqual(c.map((x) => x.argv[0]), ['npm', 'git', 'tee', 'echo']);
});
test('unwraps bash -c, env, sudo, xargs and substitutions', () => {
  const c = parseCommands(`env FOO=1 sudo -u root bash -c "npm publish" ; echo $(git push -f) | xargs -n1 rm`);
  const heads = c.map((x) => x.argv.slice(0, 2).join(' '));
  assert.ok(heads.includes('npm publish'));
  assert.ok(heads.includes('git push'));
  assert.ok(heads.includes('rm'));
});
test('captures redirects', () => {
  const c = parseCommands('echo hi > tests/a.test.js 2>&1');
  assert.equal(c[0].redirects[0].target, 'tests/a.test.js');
});
test('quotes are respected', () => {
  const c = parseCommands(`git commit -m "fix; npm publish"`);
  assert.equal(c.length, 1);
});
