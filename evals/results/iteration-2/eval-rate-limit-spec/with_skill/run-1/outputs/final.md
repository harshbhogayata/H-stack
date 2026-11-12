I've implemented `allow()` in `limiter.js` as the README describes. I changed only that file.

**How it works:**
- **Buckets:** each key gets its own bucket, created full (`capacity` tokens) the first time that key is seen.
- **Refill:** on each call, the bucket gains `elapsed seconds × refillPerSec` tokens, fractions included, and never goes above `capacity`.
- **Allow or deny:** if at least one whole token is available, `allow` spends one and returns `true`. Otherwise it returns `false` and spends nothing.
- **Time going backwards:** if `nowMs` is at or before the latest time seen for that key, no refill happens. The latest time is kept, so a later forward call only refills from that point.
- **Rounding:** I added a tiny tolerance (`1e-9`) so floating-point error doesn't block a token. Without it, 10 refills of 0.1 could add up to 0.999… and deny a token that should be there.

**Verification:** `npm test` passes (1/1, the existing "starts full" test). I also ran six more checks against the README rules, and all passed: partial refill, the capacity cap, separate keys, time going backwards, a fractional rate of 0.1/sec, and denied calls spending nothing.

**Not added:** the project's `read-only-tests` hook blocked me from writing those checks to `test/limiter.test.js`, and also to a test file in the scratchpad. So I ran them inline with `node -e` and nothing was saved. If you want them in the suite, approve test edits or run `hs phase test` and I'll add them. Nothing is committed.