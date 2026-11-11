I fixed it: due dates no longer depend on the timezone of the machine running the code. It was a timezone bug, and the tests passed only because they run in UTC.

**Reproduction:** `TZ=America/Los_Angeles npm test`
- Before the fix: 3 of the 4 existing tests failed, each one day early (for example, expected `2026-03-31`, got `2026-03-30`).
- With plain `npm test` on this UTC machine, all 4 passed, which is why the bug went unnoticed.

**Root cause** (`lib/dates.js`): `new Date('2026-03-01')` reads a plain date as midnight UTC. `addDays` then read and changed it in local time. In California, midnight UTC on Mar 1 is 4pm on Feb 28, so every due date came out a day early. This would hit any timezone west of UTC.

**Fix:** `lib/dates.js` now does all date math in UTC (`Date.UTC`, `getUTC*`/`setUTCDate`). It also rejects input that isn't a valid plain `YYYY-MM-DD` date, such as `2026-02-30` or a full timestamp. That input would have been silently shifted before. A comment there explains why local-time calls must not come back. `formatDate` now formats in UTC too; nothing else in the repo uses it.

**Keeping it from coming back:**
- **New test, `test/timezones.test.js`:** runs `dueDate` in separate processes set to six timezones, including UTC−11, UTC+14, California, and zones with daylight saving. It covers dates across daylight-saving changes, a year boundary and a leap day. It catches the bug even when the test machine itself is on UTC.
- **Added to `test/invoice.test.js`:** a test that bad dates are rejected.

**Proof:**

| Run | Result |
|---|---|
| Fix removed with `git stash`, new tests kept, UTC machine | 3 fail: Los Angeles, Pago Pago (UTC−11), date validation |
| With the fix, `npm test` under UTC, Los Angeles and Kiritimati (UTC+14) | 11/11 pass each time |

I used `git stash` because the skill's `verify-fix.mjs` needs H-Stack files that aren't installed here. No debug logging was added. The changes are uncommitted.

Invoices already sent to customers west of UTC carry the wrong due date, and this change doesn't correct them. You may want to reissue them or notify those customers.