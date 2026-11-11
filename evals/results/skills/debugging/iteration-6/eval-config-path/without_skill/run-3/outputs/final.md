`npm test` passes now.

**Cause:** `src/config.js` opened `'src/config.json'`, a path that Node resolves from whatever folder the command runs in. The test script changes into `test/` first, so Node looked for `test/src/config.json`, which doesn't exist.

**Fix:** In `src/config.js:4`, the path is now built from the file's own location with `path.join(__dirname, 'config.json')`. This finds `config.json` no matter which folder you run from.

I haven't committed the change.