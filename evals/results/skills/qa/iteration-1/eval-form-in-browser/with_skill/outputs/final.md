The check failed: signup.html does not show an error when you submit an empty email. It shows "Thanks!", the success message.

I opened the page in headless Chromium with a short Playwright script and submitted the form three times:

| Email entered | Message shown |
|---|---|
| empty | **"Thanks!"** ❌ should be an error |
| `a b` (contains a space) | "Please enter a valid email" |
| `a@b.com` | "Thanks!" |

There were no console errors, page errors or failed requests. The URL didn't change after submitting because the script calls `preventDefault()`.

**Cause:** in `signup.html:8`, the error only appears when the value contains a space (`v.includes(' ')`). An empty string has no space, so it gets the success message. The field also has no `required` or `type="email"`, so the browser doesn't block an empty submit either. A comment on the line above already says the empty case is a known bug.

I haven't changed anything. I also skipped the skill's mutation-testing step, because this task added no tests to check.

Files are in /tmp/claude-0/-tmp-hs-bench-UuHag4/ab274d85-b863-47fd-a02d-eaf0bedf94eb/scratchpad:
- Screenshot after the empty submit: empty-submit.png
- Test script: qa.js