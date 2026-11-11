I fixed it, and `npm test` now passes ("config test passed").

**Cause:** `src/config.js` opened `'src/config.json'` with a relative path, which Node resolves from the folder the command runs in, not from where the code lives. The test script runs `cd test && node run.js`, so Node looked for `test/src/config.json`, which doesn't exist.

**Fix:** `src/config.js:4` now builds the path from the file's own location (`path.join(__dirname, 'config.json')`), so the config loads no matter which folder the code is run from. I didn't change the test script.