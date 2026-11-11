The check fails: when I submit signup.html with an empty email, it shows **"Thanks!"** and no error.

I loaded the page in headless Chromium with Playwright, left the email field empty and clicked **Sign up**:
- The message was empty before submitting and read `"Thanks!"` afterwards (screenshot below confirms it).
- The page stayed where it was; the submit handler stops the normal form submission.
- There were no console messages or JavaScript errors.

As a comparison I also submitted `a b`, which does show **"Please enter a valid email"**. So the error only appears when the input contains a space.

**Cause:** in `signup.html:8` the check is `v.includes(' ')`, so an empty string passes. A comment in the file already notes this bug. The input is also `type="text"` with no `required` attribute, so the browser does nothing to block an empty submit either.

I haven't changed anything. The test script is at `/tmp/claude-0/-tmp-hs-bench-jSrfXu/f83f7eed-aeed-463d-9e3f-12e9665869fa/scratchpad/check.js` and the screenshot at `/tmp/claude-0/-tmp-hs-bench-jSrfXu/f83f7eed-aeed-463d-9e3f-12e9665869fa/scratchpad/after-empty-submit.png`.