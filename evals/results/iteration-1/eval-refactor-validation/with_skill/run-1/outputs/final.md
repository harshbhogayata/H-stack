I removed the duplication in `handlers.js`. The email regex was copied into `signup`, `invite` and `updateEmail`. It's now defined once as `EMAIL_RE`, and all three handlers call a small `isValidEmail(value)` helper instead.

The only change is where the regex check lives. Each handler still does its own input handling:
- `invite` still trims and converts the email to a string before checking it.
- `updateEmail` keeps its `!body.email ||` check, so it reads the email the same way as before.
- The status codes are unchanged: 400 for `signup` and `invite`, 422 for `updateEmail`.

**Verification:** I ran the old and new versions side by side on 75 inputs across all three handlers. They included missing and `null` emails, empty strings, numbers, booleans, objects and arrays, padded and uppercase addresses, and addresses with a newline or tab. The results matched exactly, including the error thrown when `body` has no `email`. `npm test` also passes, but that suite has only one test (a valid `signup`), so the side-by-side run is the real evidence.

I haven't committed anything.