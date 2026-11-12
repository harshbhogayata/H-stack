I added `format_greeting(display_name)` in `lib/format_greeting.js`, with tests in `tests/format_greeting.test.js`. All 4 tests pass with `npm test` (the 3 new ones plus the existing `format_name` test). The new tests failed before the function existed.

What it does:
- `format_greeting('Ada Lovelace')` returns `'Hello, Ada Lovelace!'`
- It trims spaces around the name, so `'  Ada  '` gives `'Hello, Ada!'`
- An empty, blank, `null` or `undefined` name gives `'Hello!'`

The greeting wording, the trimming and the `'Hello!'` fallback were my own choices, so change them if you want something else. The code follows `CONTRIBUTING.md`. I haven't committed anything.