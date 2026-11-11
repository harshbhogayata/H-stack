I wrote `README.md`, but `cli.js` contains only a three-line header comment and no code. So the README describes what the tool says it does, not behaviour I could run or test.

The README covers:
- **Install:** `npm install -g .` from a checkout. `package.json` maps the `tidyjson` command to `cli.js`.
- **Usage:** `tidyjson <file> [--indent N] [--sort-keys]`, with a table of the two options and two examples.
- **In-place rewrite:** the tool overwrites the file, so the README tells readers to commit or copy it first.
- **Invalid JSON:** the tool exits with code 2 and leaves the file untouched. There's a shell example that checks for this.
- **Development:** `npm test`, which runs `node --test`. The repository has no test files yet.

I left out three things the source doesn't say:
- the default indent
- whether `tidyjson` is published on npm
- what it prints when it succeeds

If you tell me those, I'll add them.