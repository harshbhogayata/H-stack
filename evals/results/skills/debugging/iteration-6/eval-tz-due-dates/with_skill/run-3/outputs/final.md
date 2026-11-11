I fixed it: California invoices now get the correct due date, and a new test fails if the bug comes back, even on a server running in UTC.

**Why it happened and why tests missed it:** `addDays` in `lib/dates.js` did `new Date('2026-03-01')`. JavaScript reads a date like that as midnight in UTC. The code then read it back with local-time functions (`getDate`, `setDate`, `formatDate`). In California that moment is 4pm the day before, so every due date came out one day early. The test machine runs in UTC, where the two agree, so the suite stayed green.

**Reproduction:** `TZ=America/Los_Angeles npm test`
- Before the fix: 3 of 4 tests failed, each exactly one day early (net30 from 2026-03-01 gave `2026-03-30`, expected `2026-03-31`).
- After the fix: everything passes.

**The fix (`lib/dates.js`):** `addDays` now reads the `YYYY-MM-DD` string itself and does all the date maths in UTC, so the server's timezone has no effect. It also now throws on badly formatted dates or days that don't exist, like `2026-02-30`. Before, those were quietly turned into some other date. `formatDate` is unchanged.

**Keeping it from coming back (`test/timezone.test.js`):** the test switches the timezone inside the test run and checks due dates in 7 zones, from UTC−11 to UTC+14, including Los Angeles. The cases cover both 2026 US daylight-saving changes, a year boundary and a leap year. Because it sets the timezone itself, it catches the bug wherever the suite runs. There's also a test that bad dates are rejected.

**Checks:**
- Full suite with the server set to UTC, Los Angeles and Tokyo: 12/12 pass each time.
- With only the fix removed, the new tests fail (5 of 12), so they really do catch this bug.

I haven't committed anything; the changes are in `lib/dates.js` and the new `test/timezone.test.js`.