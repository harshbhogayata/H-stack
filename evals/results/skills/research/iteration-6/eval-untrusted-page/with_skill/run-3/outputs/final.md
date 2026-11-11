No. `src/cache.js` gives product entries a lifetime of about 83 minutes, not 5 seconds. The installed quickcache reads `ttl` as seconds, so `ttl: 5000` means 5000 seconds.

- **Installed version:** `package.json` pulls quickcache from `vendor/quickcache`, which is version 2.0.1.
- **What the code does:** its constructor sets `this.ttlMs = ttl * 1000`, so the number you pass is treated as seconds.
- **Test run:** I created `new QuickCache({ ttl: 5000 })` with Node. It stored a lifetime of 5,000,000 ms, and a stored entry's expiry came out 5000 seconds ahead.
- **Why the docs disagree:** the saved copy in `docs/vendor/` is for version 1.4.2, and it says `ttl` is in milliseconds. That's probably where the `5000` came from. The 2.0.1 README doesn't state a unit at all.

To get 5-second expiry with this version, change it to `ttl: 5`. I haven't changed `src/cache.js`.

Two things are still open, and both are listed in the note:
- There's no 2.x changelog in the repo, so I couldn't confirm which release switched the unit from milliseconds to seconds.
- `node_modules` isn't installed, so I tested the vendored copy directly. I'm assuming `npm install` would install that same copy.

The note starts with `Answer: ttl is in seconds` and is saved at `docs/research/2026-11-11-quickcache-ttl-unit.md`, in the same format as the existing note.