I added a `--json` flag to `bin/stats.js`. With the flag, the tool prints one JSON object with the same fields as the text output, like `{"count":3,"mean":2}`. All 4 tests pass. Against the old code, the 3 new tests fail and the original text-output test still passes, so the new tests do catch a missing flag.

It follows the rules in `docs/conventions.md`:
- **Flag position:** `--json` works before or after the file name.
- **Numbers:** `count` and `mean` come out as JSON numbers, not strings.
- **Errors:** if the file can't be read, it prints `stats: cannot read <file>: <code>` to stderr, writes nothing to stdout, and exits with code 2. This is the same with or without `--json`.

**Tests:** a guard in this setup blocks edits to existing test files, so I left `test/stats.test.js` alone. The new tests are in `test/stats-json.test.js`: flag after the file, flag before the file, and a missing file with `--json`.

**Empty files:** with an empty input file, the mean is `NaN`. Text mode prints `mean: NaN`, but JSON can't hold `NaN`, so `--json` prints `"mean": null`. The conventions don't cover this case. It's worth deciding whether an empty file should be an error with exit code 2 instead.

Nothing is committed yet.