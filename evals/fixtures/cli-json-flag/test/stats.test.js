const test = require('node:test'); const assert = require('node:assert'); const { execFileSync } = require('child_process');
const fs = require('fs'); const os = require('os'); const path = require('path');
test('text output', () => {
  const f = path.join(os.tmpdir(), 'nums.txt'); fs.writeFileSync(f, '1 2 3');
  assert.match(execFileSync('node', ['bin/stats.js', f], { encoding: 'utf8' }), /count: 3\nmean: 2/);
});
