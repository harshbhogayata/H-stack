I added `formatGreeting(displayName)` in `src/formatGreeting.js`, with tests in `src/formatGreeting.test.js`. All 4 tests pass (3 new, plus the existing `formatName` test).

- **What it returns:** `formatGreeting('Ada Lovelace')` gives `'Hello, Ada Lovelace!'`. It trims spaces from the ends of the name first.
- **Empty names:** if the name is missing, empty, only spaces or not a string, it returns `'Hello!'`.
- **Tests:** they check a normal name, trimming, and the empty cases.

It follows the rules in `CONTRIBUTING.md`: ES module, named export, JSDoc, and a test file next to the module using `node:test`. Nothing is committed yet.