I fixed it: due dates now come out right whatever timezone the server runs in, and a new test makes sure that stays true.

**Cause:** `addDays` in `lib/dates.js` did `new Date('2026-03-01')`. JavaScript reads a date-only string as **midnight UTC**, but the code then used local-time `setDate`/`getDate`. In California midnight UTC is 4–5pm the day before, so every due date came out a day early, even "due on receipt", where no days are added. Your tests pass because this machine runs in UTC, and probably your CI does too; there the two clocks agree, so the bug never shows.

**Reproduction:** `TZ=America/Los_Angeles node --test`
- Before the fix: 3 of the 4 existing tests failed, each a day early (e.g. expected `2026-03-31`, got `2026-03-30`).
- After the fix: all pass.

**Fix:** in `lib/dates.js`, `addDays` now reads the `YYYY-MM-DD` parts itself and does all its maths and formatting in UTC. It also throws a clear error if the input isn't in exactly that format.

**Stopping it coming back:** I added `test/timezones.test.js`. It runs the due-date checks in separate processes, each with a fixed timezone: UTC, Los Angeles, UTC−11, UTC+14, India's half-hour offset, and Lord Howe Island's half-hour daylight-saving shift. The cases include crossing US daylight-saving changes, year end and a leap year. Because it sets the timezone itself, it catches this bug even when the tests run on a UTC machine.

**Proof:**
- With the fix removed and the new test kept, 2 of 10 tests fail, both west of UTC (Los Angeles and UTC−11).
- With the fix, 10 of 10 pass with the machine set to UTC, Los Angeles, and UTC+14.
- The skill's `verify-fix.mjs` script crashed because it couldn't find its own helper module (`ERR_MODULE_NOT_FOUND`), so I did the same check by hand with `git stash`.

`formatDate` in the same file still uses local time. Nothing in the repo calls it now, but anything outside the repo that passes it a date parsed from `YYYY-MM-DD` would get the same day-early result.

Nothing is committed yet.