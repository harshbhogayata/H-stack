I wrote `README.md`, but `cli.js` has no actual code in it. It holds only a shebang and a two-line usage comment. So the README describes how the tool is supposed to work, not code I could run or test.

The README covers:
- **What it does:** rewrites a JSON file in place, either with set indentation or with keys sorted alphabetically.
- **Install:** run `npm install -g .` to get the `tidyjson` command (from the `bin` entry in `package.json`), or run `node cli.js` directly.
- **Usage:** `tidyjson <file> [--indent N] [--sort-keys]`, with examples.
- **Exit codes:** `0` on success. `2` on invalid JSON, and the file is left untouched.
- **A warning** that the file is overwritten in place.
- **Development:** `npm test`, which runs `node --test`. There are no test files yet, so it currently tests nothing.

The source doesn't say what indentation is used when `--indent` isn't given, so I didn't state a default in the README. Once that's decided, it's a one-line addition.