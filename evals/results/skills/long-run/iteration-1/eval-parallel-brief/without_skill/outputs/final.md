I wrote the three briefs to `/tmp/hs-bench-gKiuiy/briefs.md`. Nothing has been dispatched.

All three briefs share the same structure:
- **Separate copies:** each agent works in its own git worktree, so edits can't collide while they work.
- **Shared code is off-limits:** each agent stays within its own module and test file. If its fix needs a change to shared fixtures, setup files, helpers, config or the lockfile, it stops and tells me, so two agents can't change the same code in conflicting ways.
- **No weakening tests:** they can't skip or delete tests, loosen assertions, or mock away the behaviour being tested. Before editing, each agent has to say whether the code or the test is wrong.
- **Same report format:** root cause, files changed, test output before and after, the full-suite result (marking anything that was already failing), and any shared-code change it held back.

Each brief also has one warning specific to its file:
- **cart:** a failure that's really caused by auth gets reported, not fixed in the cart code.
- **search:** run the file several times to see whether the failure is flaky, and fix timing races properly, not with sleeps, retries or longer timeouts.

**What you need to fill in:** I don't have the code, so the briefs contain placeholders. These are `<TEST_CMD>`, `<PATH>`, the current failure output, and anything you've already ruled out. The failure output is optional; without it, each agent reproduces the failure first.