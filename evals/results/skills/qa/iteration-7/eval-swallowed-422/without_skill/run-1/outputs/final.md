The signup page shows "You're subscribed" even when the server rejects the address. Those people are never added to the list, so they never get an email. I confirmed this in a real browser. The new test fails on 2 of its 3 cases because of it, and I haven't changed the app.

**Cause:** `public/app.js` sends the signup request and then shows the success message without checking the server's reply. A rejection (HTTP 422) still counts as success, so the page shows the confirmation, clears the field, and drops the server's error message.

**Who hits it:** addresses the browser accepts but the server rejects. The common case is plus-addressing like `name+news@gmail.com`, which the server blocks on purpose. Addresses like `ana@localhost` and `ana@example.c0m` are affected too. Any other server error would also look like success.

**Test (`e2e/subscribe.test.js`):** it starts `server.js` itself, opens the page in headless Chromium and submits the real form.
- A normal address must show success. This passes.
- `ana+news@example.com` and `ana@localhost` must not show "You're subscribed" and should show the server's error. Both fail today.

To make sure the test isn't just always failing, I copied the app outside the repo and added a check of the server's reply there; all 3 cases passed against that copy.

**Separate problem:** the app never sends email at all. Nothing in the repo sends mail; the server only keeps addresses in memory, and they're lost on every restart. So even people who sign up successfully get no email from this code. If another service is supposed to send the welcome issue, nothing here passes addresses to it, so someone should check with whoever owns delivery. `QA-REPORT.md` has this along with the details, repro steps and a suggested fix.

Run the test with `node --test e2e/subscribe.test.js`. `node --test e2e/` won't work on Node 22 because it treats the folder as a file.