The new test fails on the current app, so it catches the bug. The page says "You're subscribed. Check your inbox…" no matter what the server answers, so people whose signup was rejected see the same message as everyone else.

**Cause:** `public/app.js:8-14` waits for the call to the signup API but never checks whether it succeeded. The only error handling covers network failures. When the server rejects an address (it returns a 422 error), the page still shows the success message and clears the form. Those people are never added to the list, so they never get an email.

I tried this in headless Chromium against `node server.js`. Two kinds of address get past the browser's own email check but are rejected by the server:
- **`+` addresses** like `ada+news@example.com`: the server says "Addresses with + are not supported." This is the likely real-world case, since many Gmail and Fastmail users use `+`.
- **Addresses with no domain ending** like `ada@localhost`: the server says "Enter a valid email address."

The only sign of trouble is a 422 error in the browser console. The page shows nothing, and there were no other console errors or network failures.

**`e2e/subscribe.test.js`** uses node:test and Playwright, and starts the server itself on a free port. Run it with `node --test e2e/subscribe.test.js`:
- Today the normal-address test passes and both rejected-address tests fail, showing "You're subscribed…" as the page text.
- On a scratch copy I added a status check to `app.js` (`if (!res.ok) { show server error; return; }`) and all 3 tests passed, so the test passes once the bug is fixed. I then discarded the copy. The app in the repo is unchanged.

**`QA-REPORT.md`** has the details, a suggested fix, and two things I noticed but didn't check:
- **No email code in this repo:** `server.js` doesn't send email at all. It only keeps subscribers in memory, so the list is lost on restart. Either the mailer lives somewhere else, or even accepted signups get no email.
- **Mutation check not run:** it only tests changed app code, and no app code changed.

My last `git status` check needed your approval, so I didn't run it. The only files I added to the repo are the test and the report; the scratch copy and helper scripts are in the scratchpad.