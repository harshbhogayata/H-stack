I added `README.md`. It covers what tidyjson does, how to install it, its usage line and options (`<file>`, `--indent N`, `--sort-keys`), a before/after example, exit code 2 for invalid JSON, and how to run tests. I haven't committed it.

**`cli.js` has no code yet.** It's only a shebang and a comment describing the usage and the exit-code behaviour. The README documents that described behaviour, so running the tool now won't do what the README says. Running `tidyjson` currently does nothing and exits 0.

The comment didn't say some things, so I left them out rather than guess:
- **Default indent:** what happens when `--indent` isn't given.
- **Other exit codes:** what it returns on success, or when the file is missing.
- **Tests:** `npm test` runs `node --test`, but the repo has no test files yet.

If you implement the CLI or tell me the intended defaults, I'll fill those gaps in the README.