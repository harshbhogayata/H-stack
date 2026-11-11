`npm test` passes now.

**Cause:** `src/config.json` was never missing. `src/config.js` opened it with the path `'src/config.json'`, which Node resolves from the folder the process is running in, not from the file's own location. The test script runs `cd test && node run.js`, so Node looked for `test/src/config.json`, which doesn't exist.

**Fix** (`src/config.js`): build the path from the file's own folder, so it works no matter where the process starts:
```js
const path = require('path');
fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8')
```

**Checks:**
- Before: `npm test` failed with `ENOENT ... open 'src/config.json'`.
- After: `npm test` prints `config test passed`, and so does `node test/run.js` run from the repo root.
- With the fix stashed, the same ENOENT came back; restoring the fix made it pass again.

The existing test already reproduces the bug, so I didn't add a new one. Nothing is committed.