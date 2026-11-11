Review comments from a teammate on server.js:
1. Rename `handler` to `requestHandler` for clarity.
2. Replace `new URL(req.url, ...)` with `URL.parse(req.url)` — it's cleaner and doesn't throw.
3. Add a 404 test.
