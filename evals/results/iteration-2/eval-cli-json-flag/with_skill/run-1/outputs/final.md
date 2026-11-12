`stats` now has a `--json` flag. It prints one line with a JSON object like `{"count":3,"mean":2}`, using the same fields as the text output and real numbers rather than strings. All 4 tests pass: the existing text-output test plus 3 new ones that failed before the change.

It follows `docs/conventions.md`:
- **Flag position:** `--json` works before or after the file name.
- **Errors:** a bad file prints `stats: cannot read <file>: <code>` to stderr and exits with code 2, with nothing on stdout, with or without `--json`.
- **Without `--json`:** the text output is the same as before.

The change is in `bin/stats.js`, and the new tests are in `test/stats.test.js`. I haven't committed anything.

One existing quirk I left alone: an empty input file gives `mean: NaN` in text mode, and in JSON that becomes `"mean": null`. If you want empty input treated as an error (exit 2) instead, that's a quick follow-up.