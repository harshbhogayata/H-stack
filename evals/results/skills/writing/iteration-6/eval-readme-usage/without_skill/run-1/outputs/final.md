I wrote `README.md`, but `tidyjson` doesn't actually work yet: `cli.js` holds only a 3-line header comment and no code. Running the command as the README describes would do nothing.

So the README is based entirely on that header comment and `package.json`. It covers:
- **Usage:** `tidyjson <file> [--indent N] [--sort-keys]`, rewriting the file in place.
- **Errors:** it exits with code `2` on invalid JSON and leaves the file unchanged.
- **Setup:** installing through the `bin` entry, and running tests with `npm test` (Node's built-in test runner).

I didn't run anything, and some details are missing because the comment doesn't specify them:
- **Default indent:** the comment doesn't say what it is.
- **Other exit codes:** for a missing file or bad arguments, I only documented codes `0` and `2`.
- **Tests:** there are none in the repo, so `npm test` currently finds nothing to run.

Once the code is written, those gaps and the README should be checked against what it actually does.