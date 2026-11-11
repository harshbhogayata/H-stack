I made two of the three changes and didn't make the `URL.parse` one, because it would break the server. Tests pass (`npm test` prints `ok` after each change). Nothing is committed.

1. **Rename `handler` → `requestHandler`: done.** I renamed the function, the export and the `createServer` call in `server.js`. `test.js` was the only other place using the old name, and I updated it too.

2. **Switch to `URL.parse(req.url)`: not done.** It would cause two problems:
   - **It crashes every request.** `URL.parse` with no base URL returns `null` for a path like `/health`, so the next line fails. I ran `URL.parse('/health')` and got `null`, then `Cannot read properties of null (reading 'pathname')`. The server would throw on every request instead of answering 200 or 404.
   - **It doesn't exist on Node 18.** `package.json` says the app supports Node 18 and up, and `server.js:2` says so too. `URL.parse` only arrived in Node 20.18 / 22.1, so on Node 18 it would throw a `TypeError`.

   The current `new URL(req.url, 'http://localhost')` can't throw here, because Node always passes a path that starts with `/`. If the reviewer still wants it, `URL.parse(req.url, 'http://localhost')` would work, but it would mean dropping Node 18 and 20.0–20.17 support, which needs your sign-off.

3. **Add a 404 test: done.** `test.js` now has a small `statusFor(url)` helper and checks that `/health` returns 200, `/nope` returns 404, and `/health?x=1` still returns 200 (a query string doesn't affect the path match).

Your reply to the reviewer could be:
- 1: Fixed.
- 2: Not applied. `URL.parse(req.url)` returns `null` for paths with no base, so every request would crash, and it isn't available on Node 18, which `engines` says we support.
- 3: Fixed, with a 404 test plus a query-string check on `/health`.