I've added `--json` to `bin/stats.js`. All 4 tests pass: the existing text-output test and 3 new ones.

```
$ stats nums.txt --json
{"count":3,"mean":2}
```

It follows `docs/conventions.md`:
- **One JSON object on stdout** with the same `count` and `mean` fields as the text output, as numbers.
- **The flag works before or after the file** (`stats --json f` or `stats f --json`).
- **Errors look the same as before:** the message goes to stderr, the exit code is 2, and nothing is printed to stdout, with or without `--json`.

The new tests are in a new file, `test/stats-json.test.js`: one for each flag position, and one for the error case. I meant to add them to `test/stats.test.js`, but an H-Stack hook blocks edits to existing test files.

I didn't check that the new tests fail against the old code. The command to put the original `stats.js` back for that run needed approval, so I skipped it.

Two existing behaviours I left alone:
- **Empty file:** the mean comes out as `NaN`, which JSON prints as `"mean":null`.
- **Unknown flags:** they aren't rejected, so they get read as the file name.