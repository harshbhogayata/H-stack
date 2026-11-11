The page says "You're subscribed" even when the server rejects the address, so the email is never saved and no mail can go out. The cause is in `public/app.js:8`: it calls `fetch('/api/subscribe')` but never checks the response. `fetch` only fails on network errors, so a 422 still reaches the success message and `form.reset()`, which also wipes the address the user typed.

**Who hits it:** people whose address passes the browser's email check but fails the server's. The likely real-world case is plus-addresses like `jane+news@example.com`, which `server.js:10` rejects on purpose. Typos the browser lets through, like `jane@example.c`, hit it too.

**What I did:**
- **Browser check:** I ran the signup in headless Chromium against `node server.js`. The rejected addresses got a 422 from the API, but the page still showed the success message. There were no console errors; the only failed request was the 422.
- **`e2e/subscribe.test.js`:** run it with `node --test e2e/subscribe.test.js`. It starts the server on a random port itself. The valid-address test passes; the two rejected-address tests fail with `UI claimed success although the API returned 422`. Note that `node --test e2e/` errors with "module not found" under this Node version (22), so give the file path.
- **Check that the test catches the bug:** I temporarily changed `app.js` to check the response, and all 3 tests passed. I then put `app.js` back; `git status` shows it unchanged.
- **`QA-REPORT.md`:** the findings, the suggested fix (not applied), and one open question: should plus-addresses be rejected at all?

Separately, the server keeps subscribers in memory only and has no email-sending code. Even successful signups are lost on restart, and the "Check your inbox" promise depends on something outside this repo. I couldn't check whether email is sent from somewhere else.

I skipped the skill's mutation-testing step: the app has no changed lines to mutate, and the temporary fix check covers the same question.