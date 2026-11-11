The answer to both questions is no. I've saved it to `/tmp/hs-bench-041FXT/answer.md`, starting with:

```
retries_429_by_default: no
honours_http_date_retry_after: no
```

I got this from reading the vendored code; I didn't run it. The installed version is tinyretry 3.1.0, and its README says it retries 429 and honours `Retry-After`, but the code doesn't do either for your case:

1. **429 isn't retried by default.** The default list in `vendor/tinyretry/defaults.js` is `retryOn: [408, 502, 503, 504]`, with no 429. A status not on the list is returned straight away, so `pushOrders` throws `partner API returned 429` on the first attempt. The changelog for 3.0.0 says this default list changed, so the README is out of date.
2. **An HTTP-date `Retry-After` is ignored.** `parseRetryAfter` only reads a number of seconds, and a date string like yours gives no value. The client then falls back to random exponential backoff of up to 10 s, so it retries without waiting for the date. Date support was added in 2.4.0 but lost when 3.0.0 rewrote the retry code.

To fix this, `src/client.js` needs to pass `retryOn` with 429 included. It also needs its own handling for the date header, or a patch to the vendored `parseRetryAfter`. Keep in mind that tinyretry caps any delay from `Retry-After` at `maxDelay` (10 s by default), so a longer wait would also need that limit raised.