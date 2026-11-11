I fixed it, and the test passed in 50 out of 50 runs afterwards.

**Cause:** in `src/queue.js`, each job finishes after a random delay of 5–44 ms. The test waited a fixed 25 ms and then checked that all 3 jobs were done. It failed whenever any of the three jobs took longer than 25 ms.

**Fix:** the test now waits until the jobs have actually finished instead of waiting a set amount of time.
- `src/queue.js`: `push()` now returns a promise for that job, and the queue keeps track of jobs that haven't finished yet. A new `drain()` method resolves once all of them are done, including any pushed while it waits.
- `test/queue.test.js`: replaced the 25 ms sleep with `await q.drain()`.

I chose this over making the sleep longer because a longer sleep slows the test down and can still fail on a slow CI machine. The queue's behaviour is otherwise unchanged; it just gained a promise from `push()` and the `drain()` method.

I haven't committed anything.