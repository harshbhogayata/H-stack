The test is fixed: it passed 100 runs in a row, where it used to fail about half the time.

**Cause:** each job in `src/queue.js` finishes after a random 5–44 ms, but the test slept a fixed 25 ms and then checked that all 3 jobs were done. It failed whenever any job happened to take longer than 25 ms. Raising the sleep would only have made failures rarer.

**Fix:**
- **`src/queue.js`:** `Queue` now keeps track of jobs that haven't finished yet. I added a `drain()` method that resolves once they're all done, including any jobs pushed while it's waiting.
- **`test/queue.test.js`:** the test now does `await q.drain()` instead of the fixed sleep, so it checks right after the last job finishes.

This adds one public method, `drain()`, to `Queue`; nothing else about it changed. Nothing is committed.