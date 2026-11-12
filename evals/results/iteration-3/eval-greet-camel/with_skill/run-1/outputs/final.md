I added `formatGreeting(displayName)` in `src/formatGreeting.js`, with tests in `src/formatGreeting.test.js`. I ran `npm test` and all 4 tests pass: 3 new ones plus the existing `formatName` test.

```js
formatGreeting('Ada Lovelace') // 'Hello, Ada Lovelace!'
formatGreeting('  Ada  ')      // 'Hello, Ada!'
formatGreeting('')             // 'Hello!'
```

- It trims spaces from the start and end of the name.
- If the name is empty, only spaces, or missing, it returns a plain `Hello!` instead of `Hello, !`.

It follows `CONTRIBUTING.md`: a named ES module export with JSDoc, and its node:test file sits next to it in `src/`. I haven't committed anything.