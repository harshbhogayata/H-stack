I implemented `allow()` in `limiter.js` as the README describes. `npm test` passes all 5 tests: the existing "starts full" test and 4 new ones I added in `test/spec.test.js`.

How it behaves:
- **Per key:** each key gets its own bucket the first time it's seen, starting with `capacity` tokens.
- **Refill:** when time moves forward, the bucket gains `(elapsed ms / 1000) * refillPerSec` tokens, including fractions, up to `capacity`.
- **Spending:** if at least one whole token is available, `allow` spends it and returns `true`; otherwise it returns `false` and spends nothing.
- **Time going backwards:** if `nowMs` is earlier than the last time seen for that key, nothing refills. The stored time also stays put, so the next refill is measured from the latest time seen, not from the earlier one.

The new tests cover partial refill adding up to a token, the capacity limit, separate keys not affecting each other, and time going backwards.

Nothing is committed.