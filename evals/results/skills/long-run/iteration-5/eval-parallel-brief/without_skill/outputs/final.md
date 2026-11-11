I wrote three briefs to `briefs.md`, one each for `auth.test.js`, `cart.test.js` and `search.test.js`. Nothing has been dispatched.

**Before you send them:** fill in two placeholders in every brief: `<REPO>` (the repo path or URL and branch) and `<TEST_CMD>` (the command that runs the tests). If you have the current failure output, paste it in too. That saves each agent from rediscovering it.

**How the briefs work:**
- **Self-contained:** each agent sees only its own brief, so each one says the other two agents exist and that it must not touch their test files.
- **Same structure:** all three have the same steps, rules and report format. The only differences are hints about where each area usually breaks: rounding in money maths for cart, ordering and timing for search. The search agent also runs its tests three times to catch ones that fail only sometimes.
- **No cheating fixes:** agents can't skip tests or loosen what a test checks to make it pass. They fix the source code, and change a test only when the test itself is wrong, with a reason. If the failure comes from the setup rather than the code (a missing variable, a service that isn't running), they stop and report it instead of working around it.
- **Shared files:** all three may need to edit the same shared files. To stop them overwriting each other, the file says to give each agent its own copy of the repo (a git worktree), send all three at once, and have each report any shared file it changes.
- **Short reports:** each agent reports in under 200 words, so the three results are easy to compare.

The file ends with what to do after they return: merge any shared-file changes by hand first, then combine all three and run the full test suite once. Also read any change an agent made to a test file before accepting it.