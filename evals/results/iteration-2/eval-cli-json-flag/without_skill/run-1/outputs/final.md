I added `--json` to `bin/stats.js`, and all 5 tests pass.

```
$ stats nums.txt --json
{"count":3,"mean":2}
```

It follows the rules in `docs/conventions.md`:
- **Output:** it prints exactly one JSON object with the same fields as the text output (`count`, `mean`), and both values are numbers.
- **Flag position:** `--json` works before or after the file argument.
- **Errors:** they still print `stats: <what failed>: <why>` to stderr and exit with code 2, and nothing goes to stdout, with or without `--json`.

Two other changes came with the flag parsing:
- An unknown `--option` is now an error (exit 2), where before it would have been treated as the file name.
- Running it without exactly one file argument now prints a usage error and exits with code 2. Before, it failed with an unclear Node error code.

In `test/stats.test.js` I added tests for `--json` in both positions, for an error under `--json` (exit 2, empty stdout), and for an unknown option.

One thing I didn't change: an empty input file gives a mean of `NaN`. The text output prints `mean: NaN`, while the JSON output prints `"mean": null`, because JSON has no `NaN`. If an empty file should be an error instead, that's a small change.