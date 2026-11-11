I wrote `README.md`, but the tool it describes isn't built yet. `cli.js` only has a three-line usage comment and no code, so running `tidyjson` right now does nothing.

The README describes what that comment promises:
- **What it does:** rewrites a JSON file in place with tidy formatting.
- **How to use it:** `tidyjson <file> [--indent N] [--sort-keys]`.
- **Invalid JSON:** it exits with code 2 and leaves the file unchanged.

It also has install steps (`npm install -g .`, based on the `bin` entry in `package.json`), examples, an exit-code table, a warning that the file is overwritten with no backup, and the `npm test` command.

Two decisions you should check:
- **Left out:** the default indent width and what happens with a missing file or bad arguments. The code doesn't define them yet, so I didn't make them up. Once `cli.js` is written, add the default to the `--indent` row.
- **Assumed:** exit code `0` on success. That's the usual convention, but the comment doesn't say it.

There are also no test files yet, so `npm test` has nothing to run.