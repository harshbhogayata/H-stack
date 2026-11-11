I found no real bugs in `strings.js`. `capitalize` does what it should for ordinary strings. One edge case is worth knowing about, and a few behaviours are design choices rather than bugs. I didn't change any code.

**Edge case: characters outside the Basic Multilingual Plane (`strings.js:3`)**
`s[0]` reads one UTF-16 code unit, not one full character. When a string starts with a character made of two code units (a surrogate pair), `s[0]` gets only half of it. Calling `toUpperCase()` on that half does nothing, so a cased letter like Deseret `'𐐨'` (which should become `'𐐀'`) is left unchanged. Strings starting with emoji are unaffected, because emoji have no case. If this matters to you, the fix is to split on code points, e.g. `const [first, ...rest] = s; return first.toUpperCase() + rest.join('');`.

**Design choices (fine if intended):**
- **Input that isn't a string is returned unchanged.** `capitalize(null)` returns `null` and `capitalize(42)` returns `42`, with no error. That's fine if it's deliberate, but it can hide mistakes in the calling code.
- **The rest of the string is left as it is.** `capitalize('hELLO')` gives `'HELLO'`, not `'Hello'`. This is correct if the function is only meant to capitalize the first letter.
- **The result can be longer than the input.** `capitalize('ßa')` gives `'SSa'`, because German `ß` uppercases to two letters. That's correct Unicode behaviour, but it can surprise code that expects the length to stay the same.
- **No locale handling.** The function uses `toUpperCase()` rather than `toLocaleUpperCase()`, so `'i'` becomes `'I'` rather than the dotted `'İ'` that Turkish expects.
- **Leading whitespace isn't skipped.** `capitalize(' hello')` is returned unchanged.