I implemented `allow()` in `limiter.js` as the README describes. The existing test passes, and a manual run of the edge cases below gave the expected results.

- **Separate buckets:** each key gets its own bucket the first time it's seen, starting with `capacity` tokens.
- **Refill:** tokens build up continuously at `(elapsed ms / 1000) * refillPerSec`, fractions included, and never go above `capacity`.
- **Spending:** `allow` returns true and spends one token only if at least one whole token is available. Otherwise it returns false and spends nothing.
- **Clock going backwards:** if `nowMs` is earlier than the key's last timestamp, no time is counted as passing and the stored timestamp stays where it was. Without that, the same stretch of time would be counted twice once the clock moved forward again.

With `capacity: 2` and `refillPerSec: 1`, I checked that:
- half a token isn't enough to pass;
- a full token after 1s passes;
- a different key has its own full bucket;
- a call with an earlier timestamp is refused and adds no tokens;
- after a long gap the bucket caps at 2.

The only test in `test/` checks that a new bucket starts full, so the refill, separate-key and clock-going-backwards behaviour isn't covered by tests yet.