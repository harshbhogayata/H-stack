I fixed the bug and added tests that fail if it comes back. The full suite now passes when run from UTC, `America/Los_Angeles` and `Asia/Tokyo` machines. I haven't committed anything.

**Root cause** (`lib/dates.js`): `new Date('2026-03-01')` reads a date-only string as midnight UTC, but `formatDate` printed it using the server's local time. In California that moment is 4–5pm the day before, so every due date came out one day early. The same thing happens in any timezone west of UTC. Your tests passed because they ran in UTC; under `TZ=America/Los_Angeles` the original suite fails 3 of 4.

**Fix:** invoice dates are now handled as plain calendar dates, entirely in UTC, so the server's timezone and daylight-saving changes can't affect them. `parseDate` also rejects badly formatted or impossible dates (like `2026-02-30`, or a full timestamp) with an error. Before, those slipped through and produced shifted or `NaN` due dates.

**Keeping it from coming back** (`test/invoice.test.js`):
- Every due-date case runs under 7 timezones: west of UTC (Los Angeles, New York, Honolulu), east of UTC (Kiritimati, Kolkata with its half-hour offset, Sydney), and UTC itself. So the bug shows up even on a UTC CI machine.
- Each run first checks that the timezone switch actually took effect. Without that check, the matrix could quietly re-run UTC seven times and pass.
- I added cases for daylight-saving start and end, a year boundary and leap day, plus a test for rejecting invalid dates.
- I put the old `dates.js` back temporarily and ran the new tests on UTC: 25 failures (the Los Angeles, New York and Honolulu runs, plus the invalid-date test). With the fix, all pass.

Due dates that were already calculated and stored or sent to West Coast customers are still one day early. Only the calculation is fixed, so you may want to find and correct those invoices.