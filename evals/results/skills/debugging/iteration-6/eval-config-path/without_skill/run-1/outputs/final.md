I fixed it, and `npm test` now passes ("config test passed").

**Cause:** `src/config.js` opened `'src/config.json'`, a path Node looks up from wherever the process was started. The test script runs `cd test && node run.js`, so Node looked for `test/src/config.json`, which doesn't exist.

**Fix:** In `src/config.js`, the path is now built from the module's own folder with `path.join(__dirname, 'config.json')`. It finds the file no matter which directory the code is run from.

I haven't committed the change.