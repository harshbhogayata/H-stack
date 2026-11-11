I fixed it in `lib/dates.js`. The tests now run in several timezones, so this bug fails the suite if it ever comes back.

**Cause:** `addDays` called `new Date('2026-03-01')`, which JavaScript reads as midnight UTC. It then read the result back with local-time getters (`getDate()`, `getMonth()`). On a machine west of UTC, midnight UTC is still the previous evening locally, so every due date came out one day early. Running `TZ=America/Los_Angeles`, net30 from 2026-03-01 gave **2026-03-30** instead of 2026-03-31. The tests passed because they run in UTC, where the two readings match.

**Fix (`lib/dates.js`):**
- Invoice dates are treated as plain calendar dates. They are parsed from their year, month and day parts, and all the arithmetic and formatting uses UTC methods only, so the server's timezone no longer affects the result.
- Badly formatted or impossible dates (`2026-02-30`, `05/12/2026`, full timestamps) now throw an error. Before, they were silently turned into a wrong date.
- I added a comment explaining why local getters must not be used there.
- One thing to check: `formatDate` is exported and now formats in UTC instead of local time. Nothing in this repo uses it besides `addDays`, but if code elsewhere passes it `Date` objects in local time, that output will change.

**Tests (`test/invoice.test.js`):**
- Every case now runs under six timezones: UTC, Los Angeles, Honolulu, Pago Pago, Tokyo and Kiritimati (UTC+14).
- New cases cover a year boundary, both US daylight-saving changes, and a leap day.
- One test confirms the timezone switch really takes effect, so the suite can't quietly fall back to testing UTC only.

**Results:** all 51 tests pass with the fix. Against the old code, 25 fail: all 24 cases in the three timezones west of UTC, plus the new bad-date test. So the suite now catches the bug no matter what timezone CI runs in.

I haven't committed anything.