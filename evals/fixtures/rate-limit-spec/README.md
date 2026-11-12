# limiter
`createLimiter({ capacity, refillPerSec })` returns `allow(key, nowMs)`.
- Each key has its own bucket that starts full (`capacity` tokens).
- Tokens refill continuously at `refillPerSec` per second (fractions count), never above `capacity`.
- `allow` returns true and spends one token if at least one whole token is available, otherwise false and spends nothing.
- `nowMs` never goes backwards for a key; if it does, treat it as no time passing.
