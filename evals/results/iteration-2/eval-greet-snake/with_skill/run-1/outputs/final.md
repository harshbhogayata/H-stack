I added `format_greeting(display_name)` with tests, and the full suite passes (`npm test`: 4 of 4).

- **`lib/format_greeting.js`**: `format_greeting('Ada Lovelace')` returns `'Hello, Ada Lovelace!'`. It trims spaces around the name. If the name is empty, only spaces, `null` or `undefined`, it returns `'Hello!'`.
- **`tests/format_greeting.test.js`**: three tests covering a normal name, a name with extra spaces, and a missing or blank name. I ran them before writing the function and they failed, so they do catch a broken version.

The new code follows `CONTRIBUTING.md`: CommonJS, a snake_case function name, 4-space indents, `node:test` with `assert/strict`, and a named export.

The greeting text is my own choice, since you didn't specify one: `Hello, <name>!`, or `Hello!` when there's no name. It's easy to change if you want different wording. Nothing is committed yet.