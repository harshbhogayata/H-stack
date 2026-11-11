The check fails: submitting the form with an empty email shows **"Thanks!"**, not an error.

**What I did:** I opened `signup.html` in headless Chromium with Playwright, left the email field empty and clicked "Sign up".

**What I saw:**
- The page stayed on `signup.html`, so the form didn't navigate away.
- `#msg` showed `"Thanks!"`, and no error message appeared. The screenshot shows the same thing.

**Why:** In the submit handler at `signup.html:8`, the error is shown only when the value contains a space (`v.includes(' ')`). An empty string has no space, so it gets the success message. The input is also `type="text"` with no `required` attribute, so the browser's built-in validation doesn't block the submit either. A comment in the code already says this is a known bug.

I haven't changed anything. The test script is `/tmp/claude-0/-tmp-hs-bench-Mnm9gT/2cca8e46-c1d9-4635-b419-35bf7f41ee47/scratchpad/check.js` and the screenshot is `/tmp/claude-0/-tmp-hs-bench-Mnm9gT/2cca8e46-c1d9-4635-b419-35bf7f41ee47/scratchpad/empty-submit.png`.