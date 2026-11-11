I wrote `README.md`, which covers installing the tool, its usage line, the two options, what happens with invalid JSON (exit code 2, file left alone), and how to run the tests.

**`cli.js` has no actual code.** It contains only a usage comment, so every claim in the README comes from that comment and `package.json`. I couldn't run anything to confirm it. Because of that, I left out details the source doesn't state: the default indent, the exit code on success, and whether the tool accepts stdin.

Two notes:
- **No backup:** the README warns that the tool overwrites the file in place without a backup. The comment says it "rewrites the JSON file in place" and mentions no backup.
- **Tests:** `npm test` runs `node --test`, but the repo has no test files yet.