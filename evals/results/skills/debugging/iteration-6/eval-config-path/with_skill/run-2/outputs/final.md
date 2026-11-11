I fixed it: `npm test` now passes.

**Cause:** `src/config.js` opened `'src/config.json'`, and Node resolves that path from the folder you run the command in, not from where the file lives. The test script runs `cd test && node run.js`, so Node looked for `test/src/config.json`, which doesn't exist. That's the ENOENT error. The code only worked when run from the repo root.

**Fix** (`src/config.js:4`): the path is now built from the module's own folder, so it works no matter where the command is run from:
```js
fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8')
```

**Checks:**
- **Before:** `npm test` failed with `ENOENT: no such file or directory, open 'src/config.json'`.
- **After:** `npm test` prints `config test passed`. Running `node test/run.js` from the repo root also passes.
- **Without the fix:** I set the change aside with `git stash`, and `npm test` failed with the same ENOENT error. I restored it and the test passed again, so this change is what fixed it.

I couldn't run the test from a folder outside the repo because the sandbox blocks changing to other directories. `test/run.js` is the only test, and it already acts as the regression test, so I didn't add a new one. I didn't add any debug logging, and nothing is committed.