The page says "You're subscribed" even when the server rejects the address, so those people are never added and never get an email. I confirmed this in a headless Chromium browser against `node server.js`, and the new test fails on the current app because of it.

**Cause:** in `public/app.js:8-14`, the submit handler never looks at the server's response. A failed request only counts as an error if the network itself fails, so a rejection still shows the success message and clears the field.

**Main trigger:** addresses with a `+` tag, like `ana+news@example.com`. The server deliberately refuses them with a 422 error ("Addresses with + are not supported."), but the page tells the user they're subscribed. Invalid addresses that get past the browser's own check behave the same way, and so would any future server error.

**What the browser showed:**

| Input | Server response | Page says |
|---|---|---|
| `ana@example.com` | 201, accepted | subscribed (correct) |
| `ana+news@example.com` | 422, rejected | subscribed (wrong) |
| `bad@x` | 422, rejected | subscribed (wrong) |

The only console errors were the browser's own "failed to load resource: 422" lines.

**`e2e/subscribe.test.js`** (run with `node --test e2e/subscribe.test.js`) starts the server on a free port and has two tests:
- **Valid address:** passes.
- **Rejected `+` address:** fails now, with `page told the user "You're subscribed…" although the API returned 422`. It checks that the page doesn't say "subscribed", shows the server's error message, and keeps the address in the field.

To check the test passes once the bug is fixed, I made a scratch copy outside the repo and changed `app.js` there to check the response and show the error. Both tests passed. The app in the repo is unchanged.

**`QA-REPORT.md`** has the evidence, cause, suggested fix and some other observations. The most important one: nothing in this repo sends email at all. Accepted addresses are only kept in memory and are lost when the server restarts, so even valid subscribers may not get the promised first issue. I couldn't verify email delivery from here. The report also suggests reconsidering whether `+` addresses should be refused at all.

I skipped the skill's mutation check because no app code changed, so there was nothing for it to test.