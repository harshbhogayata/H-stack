I added `format_greeting(display_name)` with a test, and all 4 tests pass when I run `npm test`, including the existing one.

- **`lib/format_greeting.js`:** returns `"Hello, <name>!"`, removing spaces from the start and end of the name. If the name is empty, only spaces, or not a string, it returns `"Hello!"`.
- **`tests/format_greeting.test.js`:** checks a normal name, a name with extra spaces, and the fallback cases.

It follows the rules in `CONTRIBUTING.md`: one module in `lib/`, CommonJS named exports, snake_case names, 4-space indentation and tests with `node:test`. I haven't committed anything.