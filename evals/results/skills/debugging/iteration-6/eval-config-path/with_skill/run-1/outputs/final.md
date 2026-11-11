I fixed it, and `npm test` now passes.

**Cause:** `src/config.json` was never missing. `src/config.js` opened it with the path `'src/config.json'`, which Node looks up from the folder the command runs in, not from the file's own folder. The test script runs `cd test && node run.js`, so Node looked for `test/src/config.json`, which doesn't exist.

**Fix** (in `src/config.js`): the path is now built from the module's own location, so it works from any folder.
```js
const path = require('path');
...
fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8')
```

**Proof:** the command I used to reproduce it is `npm test`.
- **Before:** `Error: ENOENT: no such file or directory, open 'src/config.json'`
- **After:** `config test passed`. Running `node test/run.js` from the repo root also passes.
- **Fix removed:** with the change stashed, `npm test` fails with the same ENOENT. Restoring it makes the test pass again.

The existing test already reproduced the failure, so I didn't add a new test. That test is the whole suite. I didn't add any debug logging, and nothing is committed.