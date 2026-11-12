const { spawnSync } = require('child_process'); const fs = require('fs'); const os = require('os'); const path = require('path'); const assert = require('assert');
const f = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'st-')), 'n.txt'); fs.writeFileSync(f, '2 4 9');
for (const args of [['--json', f], [f, '--json']]) {
  const r = spawnSync('node', ['bin/stats.js', ...args], { encoding: 'utf8' });
  assert.strictEqual(r.status, 0, 'json exit'); assert.deepStrictEqual(JSON.parse(r.stdout), { count: 3, mean: 5 });
}
const t = spawnSync('node', ['bin/stats.js', f], { encoding: 'utf8' }); assert.match(t.stdout, /count: 3\nmean: 5/);
const e = spawnSync('node', ['bin/stats.js', '--json', '/nonexistent/x'], { encoding: 'utf8' });
assert.strictEqual(e.status, 2); assert.strictEqual(e.stdout, '', 'stdout must be empty on error'); assert.match(e.stderr, /^stats: /);
