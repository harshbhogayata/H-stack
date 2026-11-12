The email regex was copied into all three handlers in `handlers.js`. It's now defined once as `EMAIL_RE`, and `signup`, `invite` and `updateEmail` all check it through a small `isValidEmail(value)` helper.

Behaviour is unchanged. I loaded the original file from git and ran both versions side by side on 132 inputs, all three handlers each. The inputs included missing, null, empty, numbers, booleans, whitespace-padded strings, arrays, objects, and objects whose text form looks like a valid email. Every result and every error thrown matched. The existing test suite also passes, though it's only one test.

To keep behaviour exactly the same, I left three things alone:
- **What each handler validates:** each one still checks the same value as before: `signup` the raw field, `invite` its trimmed copy, `updateEmail` the raw field. So odd inputs like an object that looks like an email still behave the same.
- **The extra check in `updateEmail`:** the `!body.email ||` test is redundant, since the regex already rejects anything empty, but it isn't duplication, so it stays.
- **Status codes and responses:** still 400/422 and 201/202/200, with the same response shapes. Those differences look intentional.

Sharing one regex is safe because it has no `g` flag, so one check can't leak state into the next.

Nothing is committed. The change is a working-tree diff to `handlers.js` only.