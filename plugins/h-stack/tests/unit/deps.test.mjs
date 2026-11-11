import test from 'node:test';
import assert from 'node:assert/strict';
import { installTargets, manifestAdds, nearMiss, lev } from '../../lib/deps.mjs';

test('install targets across ecosystems', () => {
  const t = (c) => installTargets(c).map((x) => `${x.eco}:${x.name}`);
  assert.deepEqual(t('npm i -D @types/node lodash@4'), ['npm:@types/node', 'npm:lodash']);
  assert.deepEqual(t('pip install -r requirements.txt requests==2.31 "flask>=3"'), ['pypi:requests', 'pypi:flask']);
  assert.deepEqual(t('cargo add serde --features derive'), ['crates:serde']);
  assert.deepEqual(t('go get github.com/spf13/cobra@v1.8.0'), ['go:github.com/spf13/cobra']);
  assert.deepEqual(t('npm install'), []);
  assert.deepEqual(t('npm i ./local-pkg'), []);
});
test('manifest adds', () => {
  assert.deepEqual(manifestAdds('package.json', '{"dependencies":{"a":"1"}}', '{"dependencies":{"a":"1","b":"2"}}').map((x) => x.name), ['b']);
  assert.deepEqual(manifestAdds('requirements.txt', 'flask\n', 'flask\nrequests>=2\n').map((x) => x.name), ['requests']);
});
test('near-miss detection', () => {
  assert.equal(nearMiss('npm', 'lodahs'), 'lodash');
  assert.equal(nearMiss('npm', 'lodash'), null);
  assert.equal(nearMiss('pypi', 'reqeusts'), 'requests');
  assert.equal(lev('kitten', 'sitting'), 3);
});
