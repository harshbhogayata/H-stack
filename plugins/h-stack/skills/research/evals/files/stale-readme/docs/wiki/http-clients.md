# HTTP clients (team wiki)

_Last edited 2025-10-14_

We wrap `fetch` with tinyretry everywhere. It already handles rate limits: 429s are retried and it waits for `Retry-After`, whether the server sends seconds or a date. Don't add your own 429 handling on top.
