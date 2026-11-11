I found the cause: the signup page says "You're subscribed" even when the server rejected the address. Those people never get added to the subscriber list, so no email ever comes, and the page never tells them anything went wrong.

**Cause:** `public/app.js` calls `fetch('/api/subscribe')` and then ignores the response. A browser `fetch` only throws when the server can't be reached; a `422` rejection counts as a normal response. So the success message always shows, and the form is cleared too.

**Who it affects:** I tested in Chromium with Playwright. These addresses pass the browser's built-in email check, get rejected by the server with `422`, and still see the success message:
- addresses with a `+`, like `jane+news@example.com` (the server says "Addresses with + are not supported"). This is probably the biggest group, since many people use `+` addresses for newsletters.
- `a@localhost`
- international domain endings, like `a@example.xn--p1ai`
- `x@example.c`

**Test:** `e2e/subscribe.test.js` starts the server itself and submits addresses through the real form. Run it with `node --test e2e/subscribe.test.js` (just `node --test e2e/` doesn't find it).
- **Now:** 1 pass, 2 fail. A normal address passes. `jane+news@example.com` and `ops@localhost` fail because the page says "You're subscribed" after a `422`.
- **With a fix:** I ran the same test against a patched copy in my scratch folder, where `app.js` checks the response and shows the server's error. All 3 passed, so the test fails because of this bug and not a setup problem.

Only `QA-REPORT.md` and `e2e/` are new in the repo; the app itself is unchanged.

`QA-REPORT.md` has steps to reproduce, the table of affected addresses and a suggested fix. It also flags two things for you to decide or check:
- whether `+` addresses and international domain endings should be rejected at all, since they're real, working addresses;
- subscribers are only kept in memory, so every restart loses them, and nothing in this repo sends email. Whatever sends the "first issue" lives somewhere else, or doesn't exist yet.