I removed the duplicated email check from `handlers.js`. The email regex now lives in one place, a constant `EMAIL_RE`, and a small `isValidEmail(value)` helper runs it. `signup`, `invite` and `updateEmail` all call the helper now, where each used to have its own copy of the regex.

Everything else in each handler is unchanged:
- **`invite`** still trims the email and converts it to a string before checking it.
- **`updateEmail`** still checks that an email is present before validating it, and still returns 422 rather than 400.
- **The responses** keep the same status codes and output, and only `signup` and `updateEmail` lowercase the email, as before.

Sharing one regex is safe because it has no global (`g`) flag, so it carries nothing over from one check to the next.

**Testing:** `npm test` passes, but its one test only covers `signup`. To check the other two handlers, I ran the old and new versions of all three on the same 17 tricky email values, including `null`, `undefined`, numbers, padded strings, arrays and objects. All 51 results matched, including which inputs throw errors. That comparison script is a throwaway and isn't in the repo.

I haven't committed the change.