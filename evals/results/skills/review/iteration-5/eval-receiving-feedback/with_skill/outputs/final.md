I made two of the three changes and declined the `URL.parse` one. Tests pass on Node 22 (`npm test` prints `ok`). Nothing is committed.

1. **Rename `handler` to `requestHandler`: done.** I renamed it in `server.js` (the function, the export and the `createServer` call) and in `test.js`, which was the only other place that used it.
2. **Switch to `URL.parse(req.url)`: declined.** It would break in two ways:
   - `package.json` says the app supports Node 18 and up (`engines.node >=18`), and `server.js:2` says the same. `URL.parse` only exists from Node 22.1, so on Node 18–22.0 the handler would crash on every request.
   - Even on newer Node, `req.url` is a relative path like `/health`. Without a base, `URL.parse('/health')` returns `null` (I ran it to check), so `url.pathname` would throw a TypeError on every request.

   The current `new URL(req.url, 'http://localhost')` doesn't have this problem, because the base it's given means a relative path always parses. If the reviewer just wants code that can't throw, the fix is to keep the base, but `URL.parse` still needs Node 22.1+. That would mean raising the minimum Node version, which is your decision.
3. **Add a 404 test: done.** `test.js` now has a small `call(url)` helper and asserts `/health` returns 200 and `/nope` returns 404.

Suggested reply for the thread on #2: "Not changing this: `URL.parse` needs Node ≥22.1 but `engines` says ≥18, and with no base `URL.parse('/health')` returns `null`, so `.pathname` would throw on every request."