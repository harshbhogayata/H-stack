I wrote the PR description to `PR.md`. Nothing was committed or pushed.

`node test.js` passes (4 assertions). Two things you should know before using it:

- **The old code isn't in the history.** The repo has one commit (`fe6f5bf fixture`), so `git log` doesn't show the fixed-window version that `CHANGE.md` refers to. I based the description on the current `rate.js`, and the PR says that.
- **The tests don't check the sliding window itself.** All 4 assertions would also pass with a fixed-window limiter. The PR suggests a test that tells the two apart: allow calls at t=900 and t=1100, then reject one at t=1200 (a fixed window that resets at 1000 would allow it). I worked through that case by hand against the current `rate.js` but didn't run it.

The description also covers:
- why the change was made: a fixed window lets through bursts of up to twice the limit at window boundaries;
- how the new limiter works, including that rejected calls aren't recorded;
- that it now keeps every key in memory with no eviction, and each call's cost grows with the limit.