I fixed it, and `npm test` now passes.

**Cause:** `src/config.js` opened `'src/config.json'` with a path relative to whatever folder Node was started from. The `npm test` script runs `cd test` first, so Node looked for `test/src/config.json`, which doesn't exist.

**Fix:** a one-line change in `src/config.js`. It now builds the path from the module's own folder, so it finds the file wherever the process starts:
```js
fs.readFileSync(require('path').join(__dirname, 'config.json'), 'utf8')
```

**Checks:**
- **Before the fix:** `npm test` failed with `ENOENT ... 'src/config.json'`.
- **With the fix:** `npm test` prints `config test passed`. `node test/run.js` from the repo root passes too.
- **Fix removed again:** I stashed the change, `npm test` failed with the same ENOENT, and then I restored the fix.

The existing test in `test/run.js` already reproduces the bug, so I didn't add a new one. Nothing is committed.