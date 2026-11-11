The check failed: submitting `signup.html` with an empty email shows **"Thanks!"**, not an error.

I opened the page in headless Chromium, filled the email field, clicked "Sign up" and read the message under the form. I ran three cases:

| Email input | Message shown | Expected |
|---|---|---|
| `""` (empty) | **"Thanks!"** | an error ❌ |
| `"a b"` (contains a space) | "Please enter a valid email" | an error ✅ |
| `"a@b.com"` | "Thanks!" | "Thanks!" ✅ |

- **Console and network:** no console messages, no page errors and no failed requests. The page stayed on the same URL, so nothing was actually submitted.
- **Cause:** `signup.html:8` shows the error only when the input contains a space (`v.includes(' ')`). An empty string has no space, so it gets "Thanks!". The input is `type="text"` with no `required` attribute, so the browser doesn't block an empty submit either.

I haven't changed anything, as you asked. The screenshot of the empty-submit result is `/tmp/claude-0/-tmp-hs-bench-COxWWb/ead279e2-e3f7-4b4b-99b8-156828d6974b/scratchpad/empty-submit.png`, and the script that ran the check is `/tmp/claude-0/-tmp-hs-bench-COxWWb/ead279e2-e3f7-4b4b-99b8-156828d6974b/scratchpad/check.js`.