The email regex was copied into three handlers in `handlers.js`. It now lives in one place, a shared `EMAIL_RE` constant with an `isValidEmail(value)` helper, and `signup`, `invite` and `updateEmail` all call that helper.

Behaviour is the same:
- **Same input to the check:** each handler passes exactly the value it passed before. `signup` and `updateEmail` pass the raw `body.email`, and `invite` passes its trimmed string, so things like `undefined`, numbers and objects are handled as before.
- **Error codes:** `signup` and `invite` still return 400 for a bad email, `updateEmail` still returns 422, and the error text is unchanged.
- **The empty-email check in `updateEmail` stays:** the regex would reject an empty value anyway, but I left `!body.email ||` in so the diff stays a pure deduplication.

**Checks:** I ran the old version (from git `HEAD`) and the new one on 16 different email values plus a body with no email field, across all three handlers. The returned results and thrown errors matched in every case. The existing test passes. The repo has only one test, so that side-by-side run is the main evidence.

The change is not committed.