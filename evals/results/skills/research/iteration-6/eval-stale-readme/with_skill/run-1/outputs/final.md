The answer to both questions is **no**, for the tinyretry version installed here (3.1.0). Despite what its README and the team wiki say, it won't handle the partner's rate limits for you.

```
retries_429_by_default: no
honours_http_date_retry_after: no
```

1. **429 is not retried by default.** The default list of statuses to retry is `[408, 502, 503, 504]` (`vendor/tinyretry/defaults.js:5`). Any other status is returned immediately (`index.js:28`). `src/client.js` only sets `retries: 4`, so a 429 goes straight back and `pushOrders` throws. I tested this with a fake fetch that always returns 429, and it made one call and no retries.
2. **A date in `Retry-After` is ignored.** The header is parsed only as a number of seconds (`index.js:3-7`), so a date fails to parse. It then falls back to a short random backoff (`index.js:30`). With 429 added to the retry list, my test made 3 calls in about 280 ms instead of waiting until the given time. Even a value in seconds is capped at 10 seconds.

The README still lists 429 among the statuses it retries. The CHANGELOG says the default list changed in 3.0.0, which suggests the README wasn't updated. Date support was added in 2.4.0 and looks like it was lost when 3.0.0 rewrote the retry loop. I worked that out from the changelog and current code; I didn't check the 3.0.0 diff. The wiki (last edited 2025-10-14) predates 3.0.0, so its advice not to add your own 429 handling is now wrong.

To handle these 429s, the client needs to add 429 to the retry list and wait out a date-style `Retry-After` itself. I haven't checked whether a newer tinyretry release fixes either problem.

Full write-up with line citations: `/tmp/hs-bench-VHcTOy/answer.md`