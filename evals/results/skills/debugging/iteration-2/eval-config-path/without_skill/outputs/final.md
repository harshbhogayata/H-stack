`npm test` passes now.

**Cause:** `config.json` was there all along. `src/config.js` opened it with the relative path `'src/config.json'`, which Node resolves from the folder the command runs in, not from where the code lives. The test script runs `cd test && node run.js`, so Node looked for `test/src/config.json`, which doesn't exist.

**Fix:** in `src/config.js:4`, the path is now built from the file's own location (`path.join(__dirname, 'config.json')`), so it works from any folder. I also loaded the config from the repo root to check, and it still works there (`{ port: 8080, region: 'eu-west-1' }`).

I haven't committed the change.