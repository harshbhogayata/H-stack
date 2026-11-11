I made two of the three changes and left the URL parsing alone. Tests pass. Nothing is committed yet.

1. **Rename to `requestHandler`:** done. I updated the function, the export and the `createServer` call in `server.js`. `test.js` uses the new name too.
2. **Switch to `URL.parse(req.url)`:** not done.
   - **It breaks routing:** `req.url` is a relative path like `/health`, and without a base `URL.parse` returns `null`. I checked: `URL.parse('/health')` gives `null`. Reading `url.pathname` would then crash on every request.
   - **It breaks Node 18:** `URL.parse` was only added in Node 22.1 / 20.18, and `package.json` says the service supports Node 18 and later.

   If the worry is that `new URL` can throw on a malformed request path, the Node 18-safe fix is to wrap it in `try/catch` and return 400. I can add that if you want it.
3. **404 test:** added. `test.js` now has a small `request()` helper and checks that `/health` returns 200 and an unknown path returns 404.