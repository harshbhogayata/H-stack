I fixed it and `npm test` passes now.

The file wasn't missing. `src/config.js` opened the relative path `'src/config.json'`, and Node resolves that from the folder the process is running in. The test script does `cd test` first, so it looked for `test/src/config.json`, which doesn't exist.

In `src/config.js`, the path is now built from `__dirname` (the folder the module itself is in): `path.join(__dirname, 'config.json')`. The config now loads no matter which folder you run it from. I haven't committed the change.