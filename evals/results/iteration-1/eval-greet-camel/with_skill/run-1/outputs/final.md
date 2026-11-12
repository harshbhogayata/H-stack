I added `formatGreeting(displayName)` in `src/formatGreeting.js` with a test file next to it, `src/formatGreeting.test.js`, following the repo's CONTRIBUTING rules. All 4 tests pass with `npm test`: my 3 new ones plus the existing `formatName` test. I ran the new test before writing the function and it failed, so it does catch a missing implementation.

What it does:
- `formatGreeting('Ada Lovelace')` returns `'Hello, Ada Lovelace!'`.
- Spaces around the name are removed, so `'  Ada  '` becomes `'Hello, Ada!'`.
- An empty, all-spaces or `undefined` name returns `'Hello!'` instead of `'Hello, !'`.

The wording ("Hello, …!") and the generic fallback were my choices, since you didn't specify them; they're easy to change. I haven't committed anything.