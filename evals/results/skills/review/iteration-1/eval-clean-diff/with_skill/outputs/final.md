I found one real bug in `strings.js`, and it only shows up with rare characters. For ordinary text the function works correctly. I didn't change any code. There's no git diff (one fixture commit, clean tree), so I reviewed the whole file. The repo has no REVIEW.md, CLAUDE.md, tests or spec, so the only rule I could check against is what the name `capitalize` implies. I ran the function in Node on the inputs listed below.

## Findings

**1. Letters outside the Basic Multilingual Plane are not capitalized: confirmed**
- `strings.js:3`: `return s[0].toUpperCase() + s.slice(1);`
- `s[0]` takes one UTF-16 code unit. When the first character is a surrogate pair, that's only the first half of the character, and calling `toUpperCase()` on half a character does nothing.
- What I saw: `capitalize("\u{10428}x")` (Deseret small letter) returns `"𐐨x"` unchanged, but `"\u{10428}".toUpperCase()` gives `"𐐀"`. The same happens with other cased scripts outside the BMP (Osage, Adlam, Old Hungarian, Warang Citi and others).
- The pair is not broken: `"😀abc"` comes back intact, because the two halves are joined back together. So the output is never corrupted, just left uncapitalized.
- Possible fix: `const [first, ...rest] = s; return first.toUpperCase() + rest.join('');` or `s.codePointAt(0)` with `String.fromCodePoint`.

**2. Uses uppercase instead of titlecase: plausible (depends on what you intend)**
- Same line, `strings.js:3`. `toUpperCase()` is uppercasing, but capitalizing a word strictly calls for titlecase.
- What I saw: `capitalize("ǆa")` returns `"Ǆa"` (all caps) where titlecase is `"ǅa"`. Similarly `capitalize("ß")` returns `"SS"`, where titlecase would be `"Ss"`.
- JavaScript has no built-in titlecase function, so this only matters if the function has to handle these letters correctly. Without a spec I can't say it does.

## Rejected
- **Empty string or non-string input crashes:** it doesn't. Line 2 returns `""`, `null`, `undefined` and `42` unchanged.
- **Surrogate pairs get corrupted:** they don't (see finding 1).
- **Accented first letters fail:** they don't. Both precomposed `"éclair"` (→ `"Éclair"`) and `"e\u0301"` capitalize correctly.
- **Leading whitespace:** `" hi"` stays `" hi"`. That fits a function that capitalizes the first character, so it isn't a bug.

## Cleared
- `strings.js:1–5`, everything in the file: the type and empty guard, how the first character is picked out, the case conversion, and the export.

## Not reviewed
- Callers, because there are none in the repo, and locale-specific behaviour such as Turkish `i` → `İ`. `toUpperCase()` ignores locale, so that depends on whether the callers need locale-aware casing.