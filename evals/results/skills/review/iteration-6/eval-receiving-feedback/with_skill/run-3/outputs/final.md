I made two of the three changes and declined item 2. The tests pass after each change (`npm test` → `ok`). Nothing is committed yet.

1. **Rename `handler` → `requestHandler` (done).** I changed it in `server.js`: the function, the export and the `createServer` call. I also updated the import and calls in `test.js`, which is the only other place that uses it. Note that this changes the module's exported name, so any code outside this repo that imports `handler` would break.

2. **Switch to `URL.parse(req.url)` (not done).** It would break the server, for two reasons:
   - **Wrong result:** `req.url` is a relative path like `/health`, so without a base URL `URL.parse` returns `null`. I checked: `node -e "console.log(URL.parse('/health'))"` prints `null`. `url.pathname` would then throw a TypeError on every request.
   - **Too new for our Node version:** `package.json` says the app supports Node 18 and up (`"engines":{"node":">=18"}`), and `server.js:2` says the same. `URL.parse` only arrived in Node 22.1 (backported to 20.18), so on Node 18 it doesn't exist.
   
   The current `new URL(req.url, 'http://localhost')` already gives a base URL, and with a path that starts with `/` in practice it doesn't throw. A reply to the reviewer could say: "`URL.parse` returns null without a base, and we support Node 18, which doesn't have it. Keeping `new URL` with a base."

3. **Add a 404 test (done).** `test.js` now calls `requestHandler` with `/nope` and checks that it responds with status 404.