I wrote the PR description to `/tmp/hs-bench-RSC8JD/PR.md`. Nothing was committed or pushed.

- **No "before" code to compare against:** CHANGE.md says to check the git log, but the repo has only one commit (`fixture`), so the old fixed-window code isn't there. I based the description on CHANGE.md and the current `rate.js`, and the PR says so.
- **Tests:** `node test.js` passes (4 assertions). But none of them would fail under the old fixed-window behaviour. The PR suggests a test that would: with a limit of 2 per 1000 ms, allow calls at t=900 and t=999, then expect the call at t=1001 to be rejected.
- **Trade-offs flagged for reviewers:**
  - **Memory:** each key now stores up to `limit` timestamps instead of one counter.
  - **No cleanup:** idle keys are never removed from the map, so memory can grow without limit when there are many distinct keys.
  - **Per-call cost:** every call copies that key's timestamp list.