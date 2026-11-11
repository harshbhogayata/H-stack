I made two of the three review changes. I didn't make the third, swapping in `URL.parse`, because it would break the server. Tests pass.

1. **Rename (done):** `handler` is now `requestHandler` everywhere in `server.js`, including the export and the `createServer` call.
2. **`URL.parse` (not done):**
   - **Breaks every request:** `req.url` is a relative path like `/health`, and with no base URL `URL.parse` returns `null`. I checked this: `URL.parse('/health')` gives `null`, so `url.pathname` would throw on every request.
   - **Not in Node 18:** `URL.parse` first appeared in Node 20.18 / 22.1. `package.json` says the service supports Node 18 and up, and there's a comment in `server.js` saying the same.
   - **Throwing isn't a real concern:** `new URL(req.url, 'http://localhost')` already has a fixed base, so it won't throw in practice. If you ever drop Node 18, `URL.parse(req.url, 'http://localhost')` with a null check would work.
3. **404 test (done):** `test.js` now has a small `call(url)` helper and checks that `/health` returns 200 and an unknown path returns 404.

Nothing is committed yet.