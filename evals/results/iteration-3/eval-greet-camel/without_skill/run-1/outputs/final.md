I added a `formatGreeting(displayName)` function and a test file for it. The full test suite passes: 4 tests, 0 failures.

- **`src/formatGreeting.js`**: returns `Hello, <name>!` and trims spaces from the start and end of the name. If the name is missing or blank, it returns `Hello there!`. I followed the conventions in `CONTRIBUTING.md`: a named export with a JSDoc comment.
- **`src/formatGreeting.test.js`**: uses `node:test` and covers a normal name, a name with extra spaces around it, and a missing or blank name.

The fallback for a missing name and the `Hello, …!` wording were my own choices, so change either if you want something different. I haven't committed anything.