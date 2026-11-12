I've removed the duplicated email validation from `handlers.js`. The regex that was pasted into all three handlers is now defined once as `EMAIL_RE` and checked through a small `isValidEmail(value)` helper, which `signup`, `invite` and `updateEmail` all call.

Behaviour is unchanged:
- **Validation:** the helper calls `EMAIL_RE.test(value)` on the raw value, just like the old inline code, so non-string inputs (`undefined`, arrays, objects) are handled the same way.
- **What each handler keeps:** `signup` and `updateEmail` still return different status codes (400 and 422). `invite` still trims the input first, and `updateEmail` still checks for an empty value before the regex.

The existing test passes. I also ran the old and new versions side by side on 16 unusual inputs (null, empty string, padded or uppercase emails, arrays, objects, numbers) across all three handlers: 48 cases, with identical results and identical exceptions. The script is at `/tmp/claude-0/-tmp-hs-smoke-2zmmTs/f4796ad9-064d-4770-9474-f12fd84b197e/scratchpad/cmp.js`.

The empty-value check in `updateEmail` (`!body.email`) is redundant, because the regex rejects every empty value anyway. I left it in so the change stays a pure deduplication. I haven't committed anything.