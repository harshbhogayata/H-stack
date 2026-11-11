I wrote the PR description to `/tmp/hs-bench-qHVALe/PR.md`. Nothing was pushed or committed.

**Before/after comparison isn't possible.** CHANGE.md says to check the git log, but the repo has only one commit, so the old fixed-window code isn't there to compare or run. The PR says so under "Not verified".

**Evidence in the PR:**
- `node test.js` passes on the current code (4 assertions).
- I ran a quick extra check for bursts across a window boundary: with a limit of 2 calls per 1000 ms, the third call inside the window is refused. A fixed window would have allowed 4 calls within 101 ms there; that part is reasoning, not something I ran.

**Where reviewers should look first:**
- **Window edge:** a call made exactly one window length after an earlier one is allowed.
- **Refused calls aren't counted:** a client that keeps getting refused isn't locked out for longer.
- **Memory:** the per-key store never removes idle keys, so memory keeps growing with many distinct keys (for example, one per IP address).
- **Behaviour change:** clients can no longer fit two windows' worth of calls across a boundary, so any that relied on that will now be refused.

**Merge danger:** the change is easy to reverse. It touches only `rate.js` and the function signature is the same.

As the skill said, I skipped the `hs`/`receipts` steps, so the test output in the PR is from my own run rather than a saved receipt.