`npm test` passes now. The fix is in `src/config.js`.

**Cause:** `loadConfig()` opened `'src/config.json'`, a path that Node resolves from whatever folder the process is running in. The test script runs `cd test && node run.js`, so Node looked for `test/src/config.json`, which doesn't exist.

**Fix:** `loadConfig()` now finds the file relative to its own folder with `path.join(__dirname, 'config.json')`, so it works no matter where it's run from. I changed the code rather than the test script, because changing the script would only have hidden the problem for any other caller.

**Checks:**
- **Before the fix:** `npm test` failed with `ENOENT ... open 'src/config.json'`.
- **After the fix:** `npm test` prints `config test passed`. Running `node test/run.js` from the repo root also passes.
- **Fix removed:** with the change stashed, the test fails with the same ENOENT error. Once I put the fix back, it passes again.

The existing test (`test/run.js`) is the only one in the project and it's what showed the bug, so I didn't add another. Nothing is committed yet.