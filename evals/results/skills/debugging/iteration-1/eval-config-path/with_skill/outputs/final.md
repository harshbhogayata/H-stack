I fixed it, and `npm test` now passes.

**Cause:** `src/config.js` loaded the file using the path `'src/config.json'`. Node looks for that path starting from wherever the command is run, not from where `config.js` lives. The test script does `cd test && node run.js`, so Node looked for `test/src/config.json`, which doesn't exist. `config.json` itself was always where it should be.

**Fix:** a one-line change in `src/config.js` to `path.join(__dirname, 'config.json')`, so the config is found no matter which folder the command runs from. I didn't change the test.

**Proof** (`npm test` is the reproduction):
- **Before the fix:** `Error: ENOENT: no such file or directory, open 'src/config.json'`
- **After the fix:** `config test passed`, both via `npm test` and via `node test/run.js` from the repo root.
- **Fix removed again:** I stashed the change and the same ENOENT came back, then restored it.

The existing test already reproduced the bug, so I didn't add a new one. Nothing is committed yet.