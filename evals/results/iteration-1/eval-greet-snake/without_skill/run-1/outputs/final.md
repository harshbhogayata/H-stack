I added `format_greeting(display_name)` in `lib/format_greeting.js`, with tests in `tests/format_greeting.test.js`. All 4 tests pass, including the existing one for `format_name`.

- `format_greeting('Ada Lovelace')` returns `'Hello, Ada Lovelace!'`.
- Spaces around the name are removed first.
- If the name is empty, only spaces, or not a string, it returns `'Hello!'` instead.

The code follows the rules in `CONTRIBUTING.md`. I haven't committed anything.