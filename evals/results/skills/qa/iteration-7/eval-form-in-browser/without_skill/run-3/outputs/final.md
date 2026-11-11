The check fails: submitting `signup.html` with an empty email shows **"Thanks!"** where it should show an error.

I opened the page in headless Chromium with Playwright, left the email field empty and clicked **Sign up**.

- **Message shown:** the `#msg` paragraph read `"Thanks!"`. No error text appeared.
- **Navigation:** none. The page stayed on `signup.html`, because the submit handler stops the browser's normal form submission.
- **Console:** no errors or log messages.
- **Browser validation:** none either. The input is `type="text"` without `required`, so the browser doesn't block the empty submit.

The cause is in the submit handler in `signup.html`: it only shows "Please enter a valid email" when the value contains a space. An empty string has no space, so the page says "Thanks!". A comment in the code already notes this bug.

I haven't changed anything. The screenshot is at `/tmp/claude-0/-tmp-hs-bench-Ixyd2k/4051136d-4d3c-4962-8012-4df6373cf7d4/scratchpad/empty-submit.png` and the test script is `/tmp/claude-0/-tmp-hs-bench-Ixyd2k/4051136d-4d3c-4962-8012-4df6373cf7d4/scratchpad/check.js`.