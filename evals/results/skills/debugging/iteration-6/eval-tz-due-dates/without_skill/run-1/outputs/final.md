I fixed it, and the test suite now fails on any machine if the bug comes back.

**Cause:** in `lib/dates.js`, `new Date('2026-03-01')` reads the date as midnight UTC, but the code then added days and formatted the result using the server's local time. In California, midnight UTC is still the previous afternoon, so every due date came out a day early. Your tests passed because they ran in UTC. Running the original suite with California's timezone failed 3 of the 4 tests.

**Fix (`lib/dates.js`):**
- All date maths now happens in UTC, so the server's timezone and daylight-saving changes can't shift the result.
- Issue dates must be exactly `YYYY-MM-DD` and a real date. Anything else, like `2026-02-30` or a full timestamp, is rejected instead of quietly becoming the wrong day.
- `formatDate` now reads the date in UTC too. Only `addDays` calls it in this repo, but if other code passes it a Date built from local time, check that the output is still right.

**Keeping it from coming back:**
- **`test/timezones.test.js` (new):** re-runs the invoice tests under 7 timezones, including Los Angeles, New York, Honolulu, UTC+14 and India's half-hour offset. Because it sets the timezone itself, it catches the bug even on a UTC build server.
- **`test/invoice.test.js`:** new cases for due dates that cross the spring and autumn clock changes, a year end, a leap day, and badly formatted dates.

My first version of the timezone test didn't work: it passed against the old code. The nested test run reported success even when its tests failed, because of a setting Node passes to it. I removed that setting, and it now fails as it should.

**Results:** all 15 tests pass with the fix. Against the old code, the new test file fails in all 7 timezones. That proof is weaker than it looks: the bad-date test also fails against the old code, so it alone would trip the check in every zone, UTC included. What directly shows the guard would catch the California bug is the earlier run, where the original tests failed under California's timezone.

I haven't committed anything.