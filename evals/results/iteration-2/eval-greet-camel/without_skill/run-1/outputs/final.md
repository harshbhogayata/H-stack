I added `formatGreeting(displayName)` in `src/formatGreeting.js` with a test file next to it, and the full test suite passes (4 tests).

- **What it does:** it trims the name and returns `Hello, <name>!`, for example `formatGreeting('Ada Lovelace')` gives `Hello, Ada Lovelace!`. If the name is missing, empty or only spaces, it returns `Hello there!`.
- **Tests:** `src/formatGreeting.test.js` checks a normal name, a name with extra spaces around it, and the missing or blank cases.

It follows the rules in `CONTRIBUTING.md` (ES module, named export, documentation comment, test file beside the code). I haven't committed anything.