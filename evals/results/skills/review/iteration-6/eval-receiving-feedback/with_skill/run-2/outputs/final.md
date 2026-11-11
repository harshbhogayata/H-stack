I made two of the three requested changes and declined the second one. `npm test` passes after each change. Nothing is committed.

**1. Rename `handler` to `requestHandler`: done.** I renamed the function, its export and the `createServer` call in `server.js`. The only other place that used it was `test.js`, which I updated too. The export name has changed, so anything outside this repo that imports `handler` would need the same update.

**2. Switch to `URL.parse(req.url)`: declined.** It would break the server in two ways:
- **Node version:** `URL.parse` doesn't exist in Node 18, and `package.json` still supports Node 18 (`"engines": {"node": ">=18"}`, also noted in a comment at `server.js:2`). On Node 18, every request would fail because the function is missing.
- **Request paths:** `req.url` holds only the path, like `/health`. Without a base URL, `URL.parse` can't read a bare path and returns `null`. I checked on Node 22: `URL.parse("/health")` gives `null`, so the next line (`url.pathname`) would crash on every request. "Doesn't throw" is true only in that it returns `null` instead of throwing, so the crash just happens one line later.

The current `new URL(req.url, 'http://localhost')` works on every supported Node version. Even `URL.parse(req.url, 'http://localhost')` would need Node 22.1 or newer and a null check, so it isn't simpler. I'd reconsider only if the minimum Node version goes up.

**3. Add a 404 test: done.** `test.js` now has a small helper that returns the status code, and it checks that `/health` gives 200 and `/nope` gives 404. I tried to confirm the new check fails when the server returns the wrong status, but that command wasn't allowed to run, so that check wasn't done.