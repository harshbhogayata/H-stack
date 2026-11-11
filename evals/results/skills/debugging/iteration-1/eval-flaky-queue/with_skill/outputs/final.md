I fixed the flaky test: `test/queue.test.js` now passed 100 of 100 runs, against 5 of 30 before the fix.

**Cause:** the bug was in the test, not the queue. In `src/queue.js`, each job finishes after a random 5–44 ms, on purpose, to act like real I/O. The test pushed three jobs, waited a fixed 25 ms, then checked that all three were done. Each job beats 25 ms only about half the time, so all three rarely do. The failing runs show `0 !== 3` or similar: the jobs simply weren't finished yet.

**Fix:** the test no longer sleeps for a fixed time. It checks every 5 ms until `q.done.length === 3`, with a 2-second timeout that gives a clear error if the jobs never finish. It also now checks that the finished jobs are `a`, `b` and `c`, not just that there are three. `src/queue.js` is unchanged.

**How I checked it:** I wrote a small script that runs `node --test` many times and counts the results: `node /tmp/claude-0/-tmp-hs-bench-bdjjBV/fe239c80-3934-40a2-b608-40fcf9c335b9/scratchpad/loop.js <N>`.
- Before the fix: 5 passed, 25 failed out of 30.
- After the fix: 100 passed, 0 failed out of 100. This is the project's whole test suite, since this is its only test.

I didn't use the skill's `verify-fix` script. It keeps the test and undoes the code change, but here the test is the change, so the before-and-after runs above are the comparison. No debug logging was added, and I haven't committed anything.

If other tests will use the queue, a cleaner option would be for `Queue` to return a promise that resolves when all jobs finish, so tests don't have to poll. That's a change to the queue itself, so I left it alone.