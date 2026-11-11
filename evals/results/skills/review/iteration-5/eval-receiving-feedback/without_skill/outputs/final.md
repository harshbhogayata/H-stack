I made two of the three changes and skipped the URL one. Tests pass on Node 22.

1. **Renamed `handler` to `requestHandler`.** I changed it in `server.js` (the function, the export and `createServer`) and in `test.js`.
2. **Did not switch to `URL.parse`.** It would break the server in two ways:
   - **Too new for Node 18:** `URL.parse` was added in Node 22.1, but `package.json` says the app supports Node 18 and up (`"node": ">=18"`). On Node 18–22.0 every request would crash with `URL.parse is not a function`.
   - **Returns nothing for a bare path:** without a base URL, `URL.parse('/health')` returns `null` (I checked). Requests only carry a path like that, so `url.pathname` would crash even on new Node versions.

   The current `new URL(req.url, 'http://localhost')` doesn't have this problem because it supplies a base. I'd reply to the reviewer with the above. If they mainly want parsing that can't throw, a small `try/catch` around `new URL` that returns a 400 would do it on Node 18.
3. **Added a 404 test.** I moved the test's setup into a small `call(url)` helper and added a check that `/does-not-exist` returns 404, next to the existing `/health` → 200 check.

Nothing is committed yet.