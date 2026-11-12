I've implemented `allow()` in `limiter.js` to match the README. `npm test` passes (1 of 1), and separate checks I ran for each rule in the README also passed.

How it works:
- Each key gets its own bucket, created full (`capacity` tokens) the first time that key is seen.
- On each call, the bucket refills by `(nowMs - last) / 1000 * refillPerSec`, keeping fractions and never going above `capacity`.
- If at least one whole token is available, it spends one and returns `true`. Otherwise it returns `false` and spends nothing.
- If `nowMs` is earlier than the last time seen for that key, no time is counted. The bucket keeps the latest time, so going back and then forward again doesn't add tokens twice.

The repo's test file still has only the original "starts full" test. I tried to add tests for the other rules (separate keys, partial refill, the cap, a refused call spending nothing, time going backwards), but the H-Stack `read-only-tests` hook blocked writes to test files. I ran the same checks as one-off assertions with `node -e` instead, and none of them were saved to the repo.

If you want those tests kept in `test/limiter.test.js`, either approve it or run `hs phase test` to open a test-writing step, and I'll add them.