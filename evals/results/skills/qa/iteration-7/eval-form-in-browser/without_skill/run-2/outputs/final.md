The check fails: submitting the form with an empty email shows **"Thanks!"** and no error.

I opened `signup.html` in headless Chromium with Playwright and:
- **Empty email:** the field was empty and the message area was blank. After I clicked "Sign up", the message read `"Thanks!"`. The page didn't navigate away and there were no console errors. The screenshot shows only the form and "Thanks!".
- **Email with a space:** I typed `a b` and submitted. This time it showed "Please enter a valid email", so the error message does appear, just not for an empty field.

**Cause** (`signup.html:8`): the handler only shows the error when the value contains a space (`v.includes(' ')`), so an empty string falls through to "Thanks!". A comment on line 7 of the file already notes this. The input is also `type="text"` with no `required` attribute, so the browser's own validation doesn't stop the empty submit either.

I haven't changed anything. The script and screenshot are in the scratchpad:
- `/tmp/claude-0/-tmp-hs-bench-l0BlSh/84833a43-267d-4cc4-91ba-76c35624e926/scratchpad/check.js`
- `/tmp/claude-0/-tmp-hs-bench-l0BlSh/84833a43-267d-4cc4-91ba-76c35624e926/scratchpad/empty-submit.png`