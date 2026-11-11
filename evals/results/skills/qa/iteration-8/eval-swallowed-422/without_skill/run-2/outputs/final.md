The page says "You're subscribed" even when the server rejects the address, so those people are never added and never get an email.

**Cause:** `public/app.js` sends the signup request but never checks whether the server accepted it. A failed response looks the same as a success, so it always shows the success message and clears the form.

**Who it hits:** anyone whose address passes the browser's email check but fails the server's stricter check in `server.js`. I tested these in Chromium through Playwright:
- `jane+news@example.com`: rejected with "Addresses with + are not supported." This is the likely real-world case, since many Gmail and Fastmail users sign up to newsletters this way.
- `jane@localhost`, `jane@example.c`, `jane@example.123`: rejected as invalid.

Each one got 422 back from the server and "You're subscribed" on the page. A server error (5xx) would show the same false success.

**Test:** `e2e/subscribe.test.js` starts `server.js` on a free port and drives the form in Chromium. Run it with `node --test e2e/subscribe.test.js`.
- The valid-address test passes.
- The three rejected-address tests fail. Each checks that the server returns 422, the page doesn't claim success, the server's error is shown, and the address stays in the field.

To check that the test catches this bug and nothing else, I added a response check to a throwaway copy of `app.js` outside the repo. With that change all 4 tests pass. The repo's app code is unchanged; the only new files are `e2e/` and `QA-REPORT.md`.

**Also in `QA-REPORT.md`** (along with steps to reproduce and a suggested fix):
- Nothing in this repo sends email. The server only keeps addresses in memory, so every subscriber is lost when it restarts. Unless another system handles delivery, even valid signups won't get an email. Whoever owns delivery should confirm.
- Rejecting `+` addresses may be a product decision worth revisiting, because they are valid email addresses.