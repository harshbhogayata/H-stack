`npm test` passes now.

The problem was in `src/config.js`: it opened `'src/config.json'`, a path Node looks up from the folder the process is running in. The test script runs `cd test && node run.js`, so Node looked for `test/src/config.json`, which doesn't exist. The file was there all along in `src/`.

I changed it to `path.join(__dirname, 'config.json')`, which always looks next to `config.js`, so it works from any folder. I also checked that loading the config from the repo root still returns port 8080. I haven't committed the change.