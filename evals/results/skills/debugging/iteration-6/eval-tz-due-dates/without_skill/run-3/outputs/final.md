I fixed the bug. Customers in California and anywhere else west of UTC were getting due dates one day early, and a new test now catches it even though your tests run on a machine set to UTC.

**Cause:** in `lib/dates.js`, `new Date('2026-03-01')` reads a date-only string as midnight UTC. The code then worked with it in the server's local time. In California, midnight UTC is 4–5 pm the day before, so every due date came out one day early. Your tests passed only because the machine running them is on UTC. I ran them with the timezone set to `America/Los_Angeles` and 3 of the 4 failed.

**Fix (`lib/dates.js`):** invoice dates are now handled as plain calendar dates, with all the arithmetic done in UTC, so the server's timezone can't change the result. Malformed dates like `2026-02-30` or `03/01/2026` now raise an error instead of quietly becoming a different date. That's a small behaviour change: if anything upstream sends dates in another format, it will now error loudly.

**Keeping it from coming back (`test/timezones.test.js`):** this test runs the due-date cases in separate processes, one per timezone, so it doesn't matter what timezone the test machine itself uses. It covers:
- Los Angeles, New York, London and Kolkata (whose offset is a half hour)
- the extreme offsets, UTC−11 and UTC+14
- US and EU daylight-saving changes, a year boundary and a leap year

**Checks:**
- All 12 tests pass with the machine on UTC and with it on Los Angeles time.
- With the old `dates.js` put back, the new test fails on the UTC machine for Los Angeles, New York and UTC−11. So it would have caught this bug in your current test setup.

Due dates already sent to California customers were wrong. You may want to correct those invoices or tell those customers.

The changes are not committed yet.