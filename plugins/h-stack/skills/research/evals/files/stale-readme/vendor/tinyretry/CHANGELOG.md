# Changelog

## 3.1.0 (2026-06-18)
- Add an `onRetry(attempt, response)` hook.
- `maxDelay` now also caps delays taken from `Retry-After`.

## 3.0.0 (2026-02-03)
- Breaking: requires Node 18 or later.
- Rewrote the retry loop without dependencies.
- The default `retryOn` list changed; see `defaults.js`.

## 2.4.0 (2025-09-10)
- Honour `Retry-After` given as an HTTP date as well as in seconds.

## 2.3.0 (2025-05-22)
- Add `minDelay` and `maxDelay` options.
