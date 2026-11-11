signup.html does not show an error when you submit an empty email. It shows **"Thanks!"**, the success message.

I opened the file in headless Chromium with Playwright, cleared the email field and clicked "Sign up".

| Email entered | Message under the form |
|---|---|
| `""` (empty) | **"Thanks!"** |
| `"a b"` (contains a space) | "Please enter a valid email" |

- The page stayed on the same URL after submitting, so the form's handler did run.
- There were no console messages, no page errors and no failed network requests.
- The screenshot shows the empty field with "Thanks!" below it.

**Cause:** in `signup.html:8`, the handler shows the error only when the value contains a space (`v.includes(' ')`). It never checks for an empty value, and the input is `type="text"` with no `required`, so the browser doesn't block the submit either. A comment in the file already notes this.

I haven't changed anything, as you asked. The check script and screenshot are in the scratchpad:
- `/tmp/claude-0/-tmp-hs-bench-T0j3Ez/94fa726e-2f82-4df3-ab27-770eda8eaa0f/scratchpad/check.js`
- `/tmp/claude-0/-tmp-hs-bench-T0j3Ez/94fa726e-2f82-4df3-ab27-770eda8eaa0f/scratchpad/empty-submit.png`