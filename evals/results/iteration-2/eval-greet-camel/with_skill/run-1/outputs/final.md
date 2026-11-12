I added `formatGreeting(displayName)` in `src/formatGreeting.js`, with tests in `src/formatGreeting.test.js`. I wrote the tests first and ran them: they failed because the module didn't exist yet. After adding the function, `npm test` passes all 4 tests, the 3 new ones plus the existing `formatName` test.

- **Output:** it returns `Hello, <name>!`, with spaces trimmed from the start and end of the name. `formatGreeting('  Ada  ')` gives `Hello, Ada!`.
- **Missing or blank name:** an empty string, a name that is only spaces, or `undefined` returns `Hello!` instead of `Hello, !`.
- **Conventions:** it follows `CONTRIBUTING.md`: a named export, JSDoc, and a test file next to the module that uses `node:test`.

The wording of the greeting and the `Hello!` fallback were my choices, so tell me if you want different text. I haven't committed anything.