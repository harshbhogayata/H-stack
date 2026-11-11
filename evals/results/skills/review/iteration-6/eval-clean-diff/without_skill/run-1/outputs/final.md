`strings.js` is a single 3-line `capitalize` function. It works for ordinary text, and I found one real bug plus a few edge cases. I ran it on test inputs and changed no code.

**Bug: it doesn't capitalize characters outside the Basic Multilingual Plane** (`strings.js:3`)
`s[0]` takes one UTF-16 code unit, not a full character. For a character stored as a surrogate pair, `s[0]` is only half of it, and `toUpperCase()` leaves that half unchanged. So the function quietly does nothing:
```
capitalize("𐐨abc")  // → "𐐨abc"   (expected "𐐀abc")
```
Here `𐐨` is a lowercase Deseret letter. The same happens with other scripts above U+FFFF that have case, such as Adlam, Osage and Warang Citi. The fix would be to split on code points rather than code units, for example `const [first, ...rest] = s;` or `s.codePointAt(0)` / `String.fromCodePoint`.

**Edge cases (worth knowing, may be acceptable):**
- **Uppercase vs. titlecase:** a few characters have a separate titlecase form, and the function uses the all-caps form instead: `"ǆemal"` becomes `"Ǆemal"`, not `"ǅemal"`. JavaScript has no built-in titlecase method, so this is minor.
- **One character can become two:** `"ßtraße"` becomes `"SStraße"`. That is correct by Unicode rules but may surprise you, and the result is longer than the input.
- **Locale is ignored:** in Turkish, `"istanbul"` should start with `"İ"`, but the function gives `"I"`. Use `toLocaleUpperCase(locale)` if that matters.
- **Leading whitespace or punctuation:** `" x"` stays `" x"` because only index 0 is checked. That is probably intended, but check that callers expect it.
- **Non-string input:** `null`, `42` and similar values come back unchanged instead of throwing an error. That's fine if it's deliberate, but it can hide mistakes in calling code. Empty strings are handled correctly.

There's no test file covering this function, so none of these cases are tested.