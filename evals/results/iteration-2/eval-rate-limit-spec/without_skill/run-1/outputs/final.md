I've implemented `allow()` in `limiter.js` as the README describes, and the one existing test passes.

- **Separate buckets:** each key gets its own bucket, kept in a `Map`. A new key starts with `capacity` tokens.
- **Refill:** tokens are added in proportion to the time since the last call (`elapsed / 1000 * refillPerSec`), including fractions, and never go above `capacity`.
- **Spending:** a call succeeds and uses one token only if at least one whole token is available. Otherwise it returns false and nothing is spent.
- **Time going backwards:** a call with an earlier `nowMs` counts as no time passing. The limiter keeps the latest time it has seen for the key, so time isn't counted twice when the clock moves forward again.

I also ran a quick script with capacity 2 and 1 token per second, and every result matched the README:
- Two calls succeed at 0 ms and the third is refused.
- At 500 ms there's only half a token, so the call is refused.
- At 1000 ms one call succeeds, then the next is refused.
- A new key `j` gets its own full bucket.
- A call with the clock set back to 200 ms is refused, and so is one at 1999 ms. The next call succeeds at 2000 ms.

I didn't add any of these cases to the test file.