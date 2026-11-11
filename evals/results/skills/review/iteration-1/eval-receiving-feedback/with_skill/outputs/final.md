I made two of the three requested changes. I'm pushing back on the second one because it would break every request. `npm test` passes after each change; nothing is committed.

1. **Rename `handler` to `requestHandler`: done.** I renamed the function and its export in `server.js`, and updated `test.js` to match. `test.js` was the only file importing it. Anything outside this repo that imports `handler` would need the new name.

2. **Use `URL.parse(req.url)`: not done.**
   - **It breaks every request.** `req.url` is a relative path like `/health`. Without a base address to resolve it against, `URL.parse('/health')` returns `null` (I checked on Node 22). `server.js:4` would then fail on `url.pathname` with a `TypeError` for every request. It doesn't throw on its own, but that just turns a parse error into a null that crashes on the next line.
   - **It isn't available on Node 18.** `package.json` says `engines.node >= 18`, and there's a comment at `server.js:2` saying the same. `URL.parse` was added in Node 22.1 (and 20.18), so it doesn't exist on 18. This part comes from the Node docs; I couldn't run Node 18 here.
   - **Suggested reply:** "`new URL(req.url, 'http://localhost')` stays. `URL.parse` needs the same base to work with relative request paths, and it isn't available on Node 18, which we still support. If the worry is a malformed URL throwing, a `try/catch` that returns 400 would fix that. Want me to add one?"

3. **Add a 404 test: done.** `test.js` now has a small `statusFor(url)` helper. It checks that `/health` returns 200 and an unknown path (`/nope`) returns 404.