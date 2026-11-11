I wrote the PR description to `/tmp/hs-bench-diPz0G/PR.md`. Nothing was committed or pushed.

**Before/after:** git history is a single "fixture" commit, so the old fixed-window code isn't there to run or compare against. The description of the old behaviour comes from CHANGE.md only, and the PR says so under "Not verified".

**Tests:** `node test.js` passes (4 assertions). But those assertions would also pass with a fixed-window counter, so they don't prove the window slides. I ran a separate probe (not committed): with a limit of 2 per 1000 ms, a call at t=1001 is denied when earlier calls were at t=600 and t=1000. A fixed window would have allowed it, so the new limiter does behave as described. The PR suggests adding these cases to `test.js` before merging.

**Main risks the PR points reviewers to:**
- **Memory:** the per-key store never removes keys, and each key now holds up to `limit` timestamps instead of one counter. If the limiter is keyed on something like client IP, memory grows without bound.
- **Window boundary:** a call made exactly `windowMs` ago no longer counts against the limit, and no test covers that edge.
- **Speed:** every call scans that key's list of timestamps, which only matters when `limit` is large.

The PR calls the change easy to revert, since `createLimiter` keeps the same signature.

I followed the git-ship skill and skipped the `hs` and `receipts` steps as you asked.