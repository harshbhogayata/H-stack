I've saved the answer to `answer.md`. The answer to both questions is **no**:

```
retries_429_by_default: no
honours_http_date_retry_after: no
```

1. **429 isn't retried by default.** The installed tinyretry is v3.1.0, and its default list of statuses to retry in `vendor/tinyretry/defaults.js` is `[408, 502, 503, 504]`, with no 429. `src/client.js` only sets `retries: 4`, so a 429 comes straight back and `pushOrders` throws. The README and the team wiki both say 429 is retried, but they're out of date: the changelog says the default list changed in 3.0.0.
2. **An HTTP-date `Retry-After` is ignored.** `parseRetryAfter` in `vendor/tinyretry/index.js` only reads a number of seconds. A date fails that parse, so it falls back to its normal backoff of a random delay up to 10 s. Date support was added in 2.4.0 but was lost in the 3.0.0 rewrite without a changelog note. Even delays given in seconds are capped at 10 s by `maxDelay`.

To fix it, add 429 to `retryOn` in `src/client.js`, and handle the date form yourself or patch the library to convert the date into a wait time. If the partner's rate limits can last longer than 10 s, raise `maxDelay` too. The team wiki also needs updating, since it currently tells people not to add their own 429 handling.