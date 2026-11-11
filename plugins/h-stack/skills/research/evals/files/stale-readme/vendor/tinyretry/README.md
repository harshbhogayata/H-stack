# tinyretry

Small retry wrapper for `fetch`.

```js
const retry = require('tinyretry');
const fetchWithRetry = retry(fetch, { retries: 3 });
const res = await fetchWithRetry('https://example.com/api');
```

## Behaviour

- Retries network errors and responses with status 408, 429, 500, 502, 503 and 504.
- Honours the `Retry-After` response header.
- Otherwise waits with exponential backoff and full jitter (base 200 ms, cap 10 s).

## Options

| option | default | meaning |
|---|---|---|
| `retries` | `3` | retries after the first attempt |
| `minDelay` | `200` | backoff base in ms |
| `maxDelay` | `10000` | backoff cap in ms |
| `retryOn` | see above | statuses to retry |
