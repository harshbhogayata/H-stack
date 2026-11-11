I wrote `README.md` for tidyjson. It covers what the tool does, how to install it from a clone, the command line (`tidyjson <file> [--indent N] [--sort-keys]`), the warning that it overwrites the file in place, two examples, the exit code 2 behaviour on invalid JSON, and `npm test`.

**`cli.js` has no actual code.** It contains only the shebang and a two-line usage comment. Everything in the README comes from that comment and `package.json`, so I couldn't check any of it against real behaviour. I also left out details the comment doesn't give:
- the default indent when `--indent` is omitted
- whether `--sort-keys` sorts alphabetically, or also sorts nested objects
- which exit codes it uses other than 2
- whether the package is on npm (so install is described only as `npm install -g .` from a clone)

`npm test` runs `node --test`, but the repository has no test files, so it currently tests nothing.

Once the implementation exists, those gaps are worth filling in. I followed the writing skill's guidance and skipped its `hs` and `receipts` steps, as you asked.