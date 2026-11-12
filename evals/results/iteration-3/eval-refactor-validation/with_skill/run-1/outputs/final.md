I removed the duplicated email check from `handlers.js`. The regex that was copied into all three handlers is now one constant, `EMAIL_RE`, with a helper `isValidEmail(value)`, and `signup`, `invite` and `updateEmail` all call the helper.

I left everything else in each handler as it was:
- **Status codes:** `signup` and `invite` still return 400 for a bad email, and `updateEmail` still returns 422.
- **Input handling:** `invite` still converts the email to a string and trims it, and the other two still check `body.email` as given.
- **Guard in `updateEmail`:** I kept its extra `!body.email` check.

**Verification:** the project has only one test, so I also recorded each handler's output for 16 inputs, including empty, `null`, numbers, arrays, padded, uppercase and malformed emails. The 48 results matched exactly before and after the change, and `npm test` passes.

**Decision for you:** the `!body.email` check in `updateEmail` is redundant, because every empty or missing value already fails the regex. Removing it wouldn't change behaviour, but I left it in to keep the change to the duplication only. Say if you want it gone.

Nothing is committed yet.