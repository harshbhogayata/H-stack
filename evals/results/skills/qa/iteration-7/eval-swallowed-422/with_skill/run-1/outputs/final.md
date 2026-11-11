The signup page always says "You're subscribed", even when the server has rejected the address. Rejected addresses aren't saved, so those people never get an email.

**Cause:** in `public/app.js:8-13`, the page sends the signup request but never checks whether the server accepted it. Any reply, including a rejection (422), leads to the success message. The browser accepts some addresses that the server then turns down:
- **Addresses with a `+`**, like `jane+news@example.com`. The server returns "Addresses with + are not supported." This is probably what most of the reports are, since `name+tag@gmail.com` is common.
- **Addresses without a domain ending**, like `jane@localhost`. The server returns "Enter a valid email address."

I confirmed this in headless Chromium: I filled in the form, clicked Subscribe, and recorded both the server's reply and the message on the page. The only console error was the browser's own note about the 422 response; the page itself shows nothing wrong.

**Test:** `e2e/subscribe.test.js` starts `node server.js` on a free port, runs the form in a real browser and stops the server afterwards. Run it with `node --test e2e/subscribe.test.js`.
- **Right now:** 1 passes and 2 fail. The valid address passes. Both rejected addresses fail with a message like: `server rejected with "Addresses with + are not supported." but the page told the user: "You're subscribed…"`.
- **With a fix:** to make sure the test can pass, I ran it against a fixed copy of the app in my scratch folder. That copy checks the server's reply and shows its error message, and all 3 tests passed. The app in the repo is unchanged.

`QA-REPORT.md` has the full write-up and a suggested fix (not applied). It also covers two things I didn't treat as causes:
- **Is blocking `+` addresses intended?** If not, that server rule is a bug in its own right.
- **No email code:** nothing in this repo sends email, and subscribers are only held in memory, so they're lost whenever the server restarts.

I didn't run the skill's mutation check, because it only tests app code that changed and this task changed none.