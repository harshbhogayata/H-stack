I confirmed the bug in a real browser: the signup page says "You're subscribed" even when the server rejects the address. Those people never get added to the subscriber list, so no email comes.

**Cause:** `public/app.js` sends the signup request but never checks whether it succeeded. Any reply from the server is treated as success, including a 422 rejection. It also clears the input, so the person can't see what they typed.

**Which addresses the server rejects:**
- **Addresses with a `+`**, like `jane+news@example.com`. These are valid and common (Gmail users use them a lot), so this is probably what real people are hitting.
- **Addresses with no proper domain ending**, like `jane@localhost`. The browser's own email check lets these through, so the form submits them.

In both cases the server returns 422 with an error message, and the page still shows "You're subscribed." The only console output is the browser's "failed to load resource… 422" line. No requests failed at the network level.

**Test:** `e2e/subscribe.test.js` starts `node server.js` on a random port and runs Chromium. Run it with `node --test e2e/subscribe.test.js`. Results on the current app:
- **Valid address:** passes.
- **The two rejected addresses:** both fail with "UI claimed success although the API returned 422". They also expect the server's error to be shown and the typed address to stay in the field.

To check the test passes once the bug is fixed, I patched a scratch copy of `app.js` to check the response and show the error. All 3 tests passed there. The repo's app is unchanged; the only new files are `e2e/` and `QA-REPORT.md`.

**Also worth knowing (in `QA-REPORT.md`):**
- Even once the page shows the error, people with `+` addresses still can't subscribe. Whether to accept those is a product decision.
- The server keeps subscribers only in memory and never sends any email itself. Subscriptions are lost on restart, and I couldn't find whatever is supposed to send the first issue.