I wrote `README.md`, but `cli.js` has no implementation yet. It's only three comment lines with the usage string. The README describes what those comments promise, and nothing in it has been run.

It covers:
- **What it does:** reformats a JSON file and writes the result back to the same file.
- **Install:** `npm install -g .` from a clone, which uses the `bin` entry in `package.json` to add the `tidyjson` command.
- **Usage:** `tidyjson <file> [--indent N] [--sort-keys]`.
- **Overwrites and errors:** a warning that the tool overwrites the file it's given. If the JSON is invalid, it exits with code 2 and leaves the file unchanged.
- **Examples:** two sample commands.

Some things the comments don't say, so I left them out rather than guess:
- the default indent;
- how `--sort-keys` orders keys (for example, whether nested objects are sorted too);
- any other exit codes.

I also didn't add a testing section. `npm test` runs `node --test`, but the repo has no tests.