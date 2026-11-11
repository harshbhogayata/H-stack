The answer to both questions is no, for the tinyretry version in this repo (3.1.0 in `vendor/tinyretry`). I've written the explanation to `answer.md`, starting with the two required lines:

```
retries_429_by_default: no
honours_http_date_retry_after: no
```

1. **429 isn't retried by default.** `vendor/tinyretry/defaults.js` sets the default retry list to 408, 502, 503 and 504, so 429 isn't included. `src/client.js` doesn't change that list, so a 429 comes straight back and hits its error throw. I checked with a fake fetch that always returns 429: it was called once and never retried.
2. **A date in `Retry-After` is ignored.** The library only reads `Retry-After` as a number of seconds. A date fails that check, so it falls back to its own short random backoff. In a test with a `Retry-After` date 5 seconds ahead, the retry fired after 162 ms.

- **Where the opposite claim comes from:** the tinyretry README and the team wiki (`docs/wiki/http-clients.md`) both claim the opposite, but they're out of date. The changelog shows date support was added in 2.4.0, and the default retry list changed in 3.0.0. That 3.0.0 rewrite seems to have dropped date support, though the changelog doesn't say so.
- **Fixing `src/client.js`:** add 429 to the retry list, and handle the date-style `Retry-After` yourself, because tinyretry has no option for it.
- **10-second cap:** waits taken from `Retry-After` are capped at 10 seconds by default. Raise that cap if the partner asks you to wait longer.
- **Wiki:** its advice not to add your own 429 handling is wrong for this version and should be updated.

I only checked the copy in this repo, not whether a newer tinyretry release supports dates again.