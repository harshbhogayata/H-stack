I made two of the three review changes. I left out the `URL.parse` change because it would break the server. `npm test` passes.

1. **Rename `handler` to `requestHandler`:** Done in `server.js`, in the function itself, the export and the `createServer` call. `test.js` now imports the new name.
2. **Switch to `URL.parse(req.url)`:** Not done, for two reasons:
   - **It returns `null` here.** `req.url` is a path like `/health`, not a full URL, and `URL.parse` has no base to resolve it against. I ran `URL.parse('/health')` and it returned `null`, so `url.pathname` would crash on every request. Not throwing doesn't help, because the code would fail on the next line instead.
   - **It needs a newer Node than we support.** `URL.parse` was added in Node 22.1, and `package.json` says Node 18 is supported.

   The current `new URL(req.url, 'http://localhost')` is the right call for this. If the reviewer mainly wants to avoid exceptions, `URL.parse(req.url, 'http://localhost')` with a null check would work, but only after we drop Node 18 support.
3. **Add a 404 test:** Done. `test.js` now has a small `statusFor(url)` helper and checks that `/health` returns 200 and `/does-not-exist` returns 404.

I haven't committed anything. Here's a reply you could paste back to the reviewer on comment 2: *"Not applied. `URL.parse` returns `null` for a relative path like `/health` without a base, and it's only available from Node 22.1, but we support Node 18."*