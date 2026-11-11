I wrote `README.md`, but the tool itself hasn't been built yet: `cli.js` contains only a shebang and a two-line usage comment. Running `tidyjson` right now does nothing. I didn't run the command or the tests.

So the README describes the tool as that comment specifies it:

- **What it does:** it reformats a JSON file and writes the result back to the same file.
- **How to use it:** `tidyjson <file> [--indent N] [--sort-keys]`, with how to install it, what each option means and a before/after example.
- **Exit codes:** `0` when the file is reformatted, and `2` when the JSON is invalid, in which case the file isn't touched. The README notes this makes it safe to run in scripts.
- **Development:** `npm test`, which runs Node's built-in test runner.

There's a note at the top saying the tool isn't implemented yet; remove it once `cli.js` works.

The usage comment doesn't say what the default indent is or whether `--sort-keys` also sorts keys inside nested objects, so the README leaves both unstated. Fill them in once those are decided in code.