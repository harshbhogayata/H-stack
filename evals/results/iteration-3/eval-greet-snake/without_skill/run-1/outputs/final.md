I added `format_greeting(display_name)` in `lib/format_greeting.js`, with tests in `tests/format_greeting.test.js`. `npm test` passes: 4 of 4 tests, 3 new plus the existing one.

- It returns `Hello, <name>!`, with spaces trimmed from the start and end of the name.
- If the name is empty, only spaces, or not a string, it returns `Hello!`.
- It follows the rules in `CONTRIBUTING.md`: CommonJS, a snake_case name, 4-space indents, and one module per file.

Nothing is committed yet.