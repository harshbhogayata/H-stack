The answer to both questions is no. The answer is saved in `/tmp/hs-bench-klxQAC/answer.md`:

```
retries_429_by_default: no
honours_http_date_retry_after: no
```

I read the installed tinyretry 3.1.0 code and then checked both answers by running it against a fake `fetch` that always returns 429.

1. **429 is not retried by default.** The default list of status codes to retry in `vendor/tinyretry/defaults.js:5` is `[408, 502, 503, 504]`, which has no 429. `src/client.js` only sets `retries: 4`, so it uses that list. When I ran it, the 429 came back after a single call with no retry, so `pushOrders` throws straight away.
2. **The HTTP date in `Retry-After` is ignored.** `parseRetryAfter` (`vendor/tinyretry/index.js:3-7`) only understands a number of seconds. A date isn't a number, so the code falls back to a short random wait. When I added 429 to the retry list and sent a `Retry-After` date about 5 seconds ahead, it retried after 89 ms. Even when `Retry-After` is in seconds, the wait is capped at 10 seconds by default.

Three of the repo's documents say the opposite, and all three are out of date:
- **README:** it still lists 429 as retried. The 3.0.0 changelog says the default list changed.
- **Changelog:** it says 2.4.0 added support for dates. The 3.0.0 rewrite seems to have lost that without saying so; I'm inferring this from the code.
- **Team wiki** (`docs/wiki/http-clients.md`, last edited 2025-10-14): it describes the old 2.4 behaviour and says not to add your own 429 handling. For the version installed here, that advice is wrong.

`answer.md` also lists possible fixes, none of which I've applied: add 429 to the retry list in `src/client.js`, handle date-form `Retry-After` yourself, and raise the 10-second cap. I didn't check whether a tinyretry release after 3.1.0 fixes either problem.