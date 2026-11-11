I found no bugs that matter in `strings.js`, and I didn't change any code. I ran `capitalize` on a set of edge-case inputs in node.

**Findings**

1. **Minor, confirmed: letters outside the Basic Multilingual Plane are not capitalized.**
   - `strings.js:3`: `return s[0].toUpperCase() + s.slice(1);`
   - JavaScript strings are UTF-16, so `s[0]` is only the first code unit. For a character made of two code units (a surrogate pair), `toUpperCase()` gets half a character and does nothing.
   - Example: `capitalize("𐐨x")` returns `"𐐨x"` but should return `"𐐀x"` (a Deseret letter).
   - Severity: minor. Few letters with case live in that range (Deseret, Osage, Adlam and a few others), so ordinary text won't hit this. Only fix it if the function is meant to handle all scripts. Iterating by code point, for example with `[...s]` or `s.codePointAt(0)`, would fix it.

**Rejected suspicions** (checked, not bugs):
- Empty string returns `""`. Line 2 guards it, so there's no crash.
- `null`, numbers and other non-strings come back unchanged. That looks like a deliberate pass-through, not a crash.
- Emoji first (`"😀a"`) and leading whitespace (`" hi"`) both come back unchanged, which is correct because the first character has no case.
- `"ßa"` becomes `"SSa"`, so the string gets one character longer. That is the standard uppercase rule, not a bug.
- `"ǆa"` becomes `"Ǆa"` (full uppercase) rather than the title-case form `"ǅa"`. Arguably imperfect, but it doesn't matter in practice.

**Cleared:** the type and empty-string guard (line 2), first-character uppercasing and slicing (line 3), and the export (line 5).

**Not reviewed:** nothing; the file is 5 lines. The repo has no tests, spec, REVIEW.md or CLAUDE.md, so I could only judge it against what the function obviously means to do.