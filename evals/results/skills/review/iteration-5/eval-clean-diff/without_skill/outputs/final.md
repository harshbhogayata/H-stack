I found no real bugs in `strings.js`. It's a 5-line `capitalize` function that handles empty strings and non-string input correctly, and works as expected for normal text. I didn't change anything.

There are three edge cases with non-English text, ordered from most to least likely to matter:

1. **Letters outside the Basic Multilingual Plane don't get capitalized** (`strings.js:3`). `s[0]` takes one UTF-16 code unit, not a full character. For a string starting with a character stored as a surrogate pair, `s[0]` is half a character, and `toUpperCase()` does nothing to it. The string comes back intact but unchanged. For example, `capitalize('𐐨abc')` (Deseret) returns `'𐐨abc'` instead of `'𐐀abc'`. Emoji aren't affected, since they have no uppercase form. Using `[...s]` or `s.codePointAt(0)` / `String.fromCodePoint` would fix it.

2. **Some letters become two capitals.** `'ß'.toUpperCase()` is `'SS'`, so `capitalize('ßeta')` returns `'SSeta'`. The ligature `'ﬁ'` becomes `'FI'` the same way. If you want "only the first letter capitalized", the result there would be `'Sseta'`. Whether that matters depends on what you use the function for.

3. **It ignores the user's language.** `toUpperCase()` doesn't use locale rules, so Turkish `'istanbul'` becomes `'Istanbul'` instead of `'İstanbul'`. `toLocaleUpperCase(locale)` would fix that if you need it.

The function also returns non-string input such as `null` or `42` unchanged instead of throwing an error. That looks deliberate, but callers should know about it.