The page says "You're subscribed" even when the server rejects the address, so those people are never added to the list. I reproduced this in Chromium with Playwright.

**Cause:** `public/app.js` sends the signup request but never checks the response. A browser request only throws an error when the network fails, so when the server says no (HTTP 422), the page still shows the success message and clears the field. The server's error message is never shown.

**Who it hits:** two kinds of address pass the browser's own email check but are rejected by the server:
- **Addresses with a `+`**, like `name+news@gmail.com`. The server rejects these on purpose, and they're the most likely real-world trigger because many people use them for newsletters.
- **Domain endings that aren't all letters**, like `example.c0m`. The server's address check rejects these.

**Test:** `e2e/subscribe.test.js` starts `server.js` on a random port and fills in the form in Chromium. Run it with `node --test e2e/subscribe.test.js`. Right now 1 test passes and 2 fail:
- **Passes:** a normal address is accepted and the page confirms it.
- **Fails:** a `+` address gets a 422 from the server, but the page says "You're subscribed." This test also expects the server's error text to be shown.
- **Fails:** an address with a bad domain ending gets a 422, but the page says "You're subscribed."

**Report:** `QA-REPORT.md` has the cause, reproduction steps, a table of affected inputs, the test results, and a suggested fix. The fix is to check the response in `app.js` and show the server's error. Separately, you may want to decide whether to accept `+` addresses at all. I didn't change the app.

**Also worth knowing:** this server doesn't send any email at all. It only keeps addresses in memory, so they're lost when the server restarts. Unless another service does the sending, even people who sign up successfully won't get the email the page tells them to look for.