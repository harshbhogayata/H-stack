I implemented `allow()` in `limiter.js` as the README describes. The existing test passes, and a quick manual run of the edge cases below gave the expected results.

- **Separate buckets:** each key gets its own bucket in a `Map`, created full (`capacity` tokens) the first time that key is seen.
- **Refill:** tokens refill continuously as `elapsedMs / 1000 * refillPerSec`, keeping fractions, and never go above `capacity`.
- **Spending:** `allow` returns true and spends one token only when at least one whole token is there; otherwise it returns false and spends nothing.
- **Time going backwards:** if `nowMs` is at or before the key's last timestamp, it counts as no time passing. The stored timestamp doesn't move back, so a later call can't double-count time it already credited.

The manual run used capacity 2 and 1 token per second:
- **Refill:** at 0 ms it allowed, allowed, then denied. At 500 ms it denied (half a token), and at 1000 ms it allowed once more.
- **Backwards time:** after the call at 1000 ms, a call at 200 ms was denied and refilled nothing. At 1999 ms it was denied (0.999 tokens); at 2000 ms it allowed.
- **Other keys:** a new key, `j`, started full.
- **Cap:** after a long gap, only 2 calls were allowed.

These edge cases were checked by hand; I didn't add them to the test suite.