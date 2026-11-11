I reproduced the bug in a real browser. The page says "You're subscribed" even when the server rejects the email address, so those people were never signed up and no email can arrive.

**Cause:** `public/app.js` sends the signup request and then shows the success message without checking the server's answer. It only shows an error if the network is down. When the server rejects an address (HTTP 422), the page still says "You're subscribed. Check your inbox…", clears the form, and never shows the server's error message.

**Who hits it:**
- **Addresses with `+`** (e.g. `alice+news@example.com`). The server rejects these on purpose with "Addresses with + are not supported." This is probably most of the reports, since `+` addresses are common with Gmail.
- **Addresses the browser accepts but the server doesn't**, like `a@b.c`.

Normal addresses, mixed-case addresses and ones with extra spaces work correctly.

**Test:** `node --test e2e/subscribe.test.js` starts the server on a random port and uses the real page in Chromium. It currently has 1 pass and 2 fails:
- A valid address shows the success message: passes.
- A `+` address the server rejects must not show success: fails.
- `a@b.c`, which the server rejects, must not show success: fails.

To check the test turns green after a fix, I swapped in a patched `app.js` inside the browser only. The two rejected addresses then showed the server's error messages and the valid one still showed success. The repo is unchanged. The test also passes if you decide to accept `+` addresses instead.

**Also worth knowing:** `server.js` never sends any email. It only keeps signups in memory, so they're lost on restart. If the first issue is supposed to go out from somewhere else, that system can't see these signups. Even people who sign up successfully won't get an email from this code.

`QA-REPORT.md` has the full results table, the suggested fix (check the response before showing success), and the question for product on whether `+` addresses should be allowed.