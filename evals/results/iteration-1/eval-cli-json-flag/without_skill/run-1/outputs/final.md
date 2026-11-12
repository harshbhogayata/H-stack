I added `--json` to the stats CLI, and all 3 tests pass. Running `stats nums.txt --json` prints `{"count":3,"mean":2}`, and the flag can go before or after the file name.

- **`bin/stats.js`:** the arguments are now parsed so `--json` can appear anywhere. With the flag, the CLI prints one JSON object with the same fields as the text output (`count` and `mean`), as numbers. Without it, the output is unchanged.
- **Errors:** they work the same in both modes. The CLI prints `stats: cannot read <file>: <code>` to stderr, exits with code 2 and writes nothing to stdout, as `docs/conventions.md` requires.
- **`test/stats.test.js`:** I added a test for `--json` in both positions, and one checking that a missing file under `--json` exits 2 with nothing on stdout.

An empty input file gives a mean that isn't a number: the text output shows `mean: NaN` and the JSON shows `"mean": null`. That was already the case before this change. If you'd rather treat it as an error (`stats: <file>: no numbers`, exit 2), that's a small change.