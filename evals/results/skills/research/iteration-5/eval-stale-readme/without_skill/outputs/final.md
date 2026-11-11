The answer to both questions is no: tinyretry 3.1.0 doesn't retry a 429 by default, and it ignores a `Retry-After` given as an HTTP date. I've saved the full answer to `/tmp/hs-bench-LdIbpF/answer.md`. Its README says it handles both, but the code doesn't, so the README is out of date.

1. **429 isn't retried by default.** `vendor/tinyretry/defaults.js` only retries 408, 502, 503 and 504. The defaults changed in version 3.0.0. `src/client.js` doesn't set `retryOn`, so a 429 comes straight back and `pushOrders` throws. When I ran it with a fake server that always returned 429, it made just one request.
2. **An HTTP-date `Retry-After` is ignored.** `parseRetryAfter` only understands a number of seconds, so a date falls back to short random waits. I set the header to a date 5 s ahead and turned on retrying 429, and the retries came about 140 ms and 230 ms after the first request. Support for dates was added in 2.4.0 but lost when 3.0.0 was rewritten. Also, even a wait given in seconds is capped at `maxDelay`, which is 10 s by default.

**Fix in `src/client.js`:**
- Add 429 to `retryOn`.
- Turn an HTTP-date `Retry-After` into a wait yourself (`Date.parse(value) - Date.now()`).
- Raise `maxDelay` if the partner may ask you to wait longer than 10 s.