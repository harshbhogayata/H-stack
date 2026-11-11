I fixed it: California invoices now get the right due date, and the suite will fail if this bug ever comes back, whatever time zone the tests run in.

**Cause:** `addDays` in `lib/dates.js` read `new Date('2026-03-01')`, which JavaScript treats as midnight UTC. It then did the math and formatting in the server's local time. In California that instant is still the evening of Feb 28, so every due date came out one day early. Your tests passed because they only ever ran on UTC machines, where local time and UTC are the same.

**Reproduction:** `TZ=America/Los_Angeles node --test`
- Before the fix: 3 of 4 tests failed, each a day early (e.g. expected `2026-03-31`, got `2026-03-30`).
- With `TZ=UTC`: 4 of 4 passed, which is why the bug was never caught.

**Fix (`lib/dates.js`):** `addDays` now treats the issue date as a plain calendar date and does the arithmetic in UTC only, so the server's time zone no longer matters. It also now throws a clear error on input that isn't `YYYY-MM-DD`, instead of silently guessing.

**Regression test (`test/timezones.test.js`):** this is the part that stops it coming back. The test re-runs `dueDate` in separate processes set to UTC, Los Angeles, Pago Pago (UTC−11), Kiritimati (UTC+14), Kolkata (UTC+5:30) and London. Each run covers daylight-saving changes, the year end and a leap year.

**Results:**
- With the fix: 10 of 10 tests pass under UTC, Los Angeles and Kiritimati.
- With the fix removed (`lib/` stashed), on a UTC machine: the new test fails for Los Angeles and Pago Pago. So it catches the bug even where your old tests passed.

I didn't change `formatDate`. It still uses local time, which is right for formatting a real moment in time but wrong for calendar dates like these, so it shouldn't be used for them. I haven't committed anything.