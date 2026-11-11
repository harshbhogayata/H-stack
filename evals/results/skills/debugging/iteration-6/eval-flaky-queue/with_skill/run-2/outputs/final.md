I fixed the flaky test. The bug was in the test, not in the queue, so the only file changed is `test/queue.test.js`.

**Cause:** each job in `src/queue.js` finishes after a random 5–44 ms, but the test slept a fixed 25 ms and then checked that all 3 jobs were done. Whenever any job drew a delay over about 25 ms, the check failed.

**Reproduction:** I added a small preload that replaces `Math.random` so every job gets the same delay:
```
node --require …/scratchpad/slow.js --test   # every job takes 44 ms → before: fail (expected 3, actual 0)
node --require …/scratchpad/fast.js --test   # every job takes 5 ms  → before: pass
```

**Fix:** the test now checks every 5 ms until `q.done.length === 3` instead of sleeping a fixed time. It gives up after 2 seconds with a clear error, so a real hang still fails. The final check now also confirms the right jobs finished (`['a','b','c']`), not just that there are three.

**Results:**

| | Before the fix | After the fix |
|---|---|---|
| Forced slow (44 ms) | fail | pass |
| Forced fast (5 ms) | pass | pass |
| Repeated `npm test` runs | 2 of 10 passed | 50 of 50 passed |

The fixed test also finishes as soon as the jobs do, rather than always waiting 25 ms. The two preload scripts are in my scratchpad, not in the repo. Nothing is committed.