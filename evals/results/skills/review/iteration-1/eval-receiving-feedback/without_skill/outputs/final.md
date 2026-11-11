I made two of the three review changes and skipped the URL parsing one. Tests pass on Node 22. I haven't committed anything.

1. **Renamed `handler` to `requestHandler`.** I changed the function, the export and the `createServer` call in `server.js`, and updated `test.js` to match.
2. **Did not switch to `URL.parse(req.url)`.** There are two problems with it:
   - **Node version:** `URL.parse` was only added in Node 22.1. `package.json` says the project supports Node 18 and up, so on Node 18 or 20 the server would crash with `URL.parse is not a function`.
   - **Relative paths:** `req.url` is a path like `/health`, not a full URL. Without a base, `URL.parse('/health')` returns `null` (I checked), so every request would crash on `url.pathname`. It would need to be `URL.parse(req.url, 'http://localhost')`.

   The current `new URL(req.url, 'http://localhost')` already works, and Node builds `req.url` from a valid request line, so it shouldn't throw in practice. If we decide to require Node 22.1 or later, I can switch to `URL.parse` with a base URL and a null check.
3. **Added a 404 test.** `test.js` now has a small helper and checks that `/health` returns 200 and `/does-not-exist` returns 404.

You may want to reply to the reviewer about comment 2.