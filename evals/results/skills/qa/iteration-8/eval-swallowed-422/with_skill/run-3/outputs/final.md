The bug is in the page, not the server: it shows "You're subscribed" whatever the server answers. When the server rejects an address (HTTP 422), the person still sees the success message but is never added to the list, so they never get an email.

**Cause:** `public/app.js:8-14` sends the signup request but never looks at the reply. The success message and the form reset run on every response; the error branch only catches network failures, and a rejection isn't one.

**Who it hits:** I drove the page in headless Chromium. The browser accepts these addresses, the server rejects them, and the page still says "You're subscribed":
- `jane+news@example.com`: the server says "Addresses with + are not supported." This is probably most of the reports, since many people (often Gmail users) put a `+tag` in their address.
- `me@localhost` and `a@b.c`: the server says "Enter a valid email address."

The form is also cleared, so people can't see what they typed. The only console output is the browser's own "422" line; the app logs nothing.

**Test:** `e2e/subscribe.test.js` starts `server.js` on a free port itself. Run it with `node --test e2e/subscribe.test.js`:
- **A valid address:** passes now.
- **`jane+news@example.com` and `me@localhost`:** both fail now, because the page says "subscribed" after the server answered 422.

To check the test fails for the right reason, I applied a minimal fix to a copy of the app outside the repo (check the reply, show the server's error). All 3 tests passed against that copy. The app in the repo is unchanged, and the test accepts any wording of the error message.

`QA-REPORT.md` has the details and a suggested fix. It also raises two open questions:
- Should `+` addresses really be rejected? If that's intended, the page should say so before people submit.
- Is anything actually sending these emails? Signups are only held in memory, so they're lost when the server restarts, and nothing in this repo sends email.

I skipped mutation testing because the only change in the repo is the new test file, so there's no changed app code to mutate.