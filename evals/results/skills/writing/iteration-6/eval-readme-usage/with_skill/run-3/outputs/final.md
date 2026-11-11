I wrote `/tmp/hs-bench-zMQ3Oo/README.md`. It covers installing from the repo, the command syntax, both options, the fact that the tool overwrites the input file, exit code 2 on invalid JSON, and `npm test`.

`cli.js` contains only a usage comment and no working code, so the README describes behaviour the tool doesn't have yet. Everything in it comes from that comment and from `package.json`, which are the only two files in the repo. Because there's no code to read, the README leaves out:

- the default indent when `--indent` isn't given
- what happens when `--indent` gets a bad value
- any exit codes other than 2
- whether `--sort-keys` also sorts objects nested inside other objects

Once the code exists, those are the things to add.

The install step is `npm install -g .`, run from a clone of the repo. I didn't check whether `tidyjson` is published on npm. If it is, change that step to `npm install -g tidyjson`.

There are no test files yet, so `npm test` currently has nothing to run.