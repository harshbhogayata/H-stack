I added a `format_greeting(display_name)` function in `lib/format_greeting.js`, with tests in `tests/format_greeting.test.js`. `npm test` now passes all 4 tests: the 3 new ones and the existing `format_name` test.

What it returns:
- **A name:** `'Ada Lovelace'` gives `'Hello, Ada Lovelace!'`.
- **Extra spaces:** they're trimmed, so `'  Ada  '` gives `'Hello, Ada!'`.
- **No name:** an empty or all-space string, `null` or `undefined` gives `'Hello!'`.

I wrote the test first and ran it to make sure it failed before adding the function. The code follows `CONTRIBUTING.md`: CommonJS, a snake_case name, 4-space indents, one module per file, no default export, and tests use `node:test` with `assert/strict`.

I picked the `'Hello, <name>!'` wording and the fallback for a missing name myself; tell me if you want different ones. Nothing is committed yet.