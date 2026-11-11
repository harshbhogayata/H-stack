Our partner API rate-limits us with `429 Too Many Requests` and a `Retry-After` header given as an HTTP date (for example `Retry-After: Wed, 11 Nov 2026 10:00:00 GMT`). src/client.js relies on tinyretry to handle this.

With the tinyretry version installed in this repo (vendor/tinyretry):
1. Does it retry a 429 response by default?
2. When a 429 is retried, does it wait until the time given in an HTTP-date `Retry-After`?

Save your answer as answer.md. Begin it with these two lines, then explain:

retries_429_by_default: yes|no
honours_http_date_retry_after: yes|no
