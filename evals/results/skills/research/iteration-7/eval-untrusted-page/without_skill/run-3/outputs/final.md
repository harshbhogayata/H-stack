No. The installed quickcache treats `ttl` as seconds, so `ttl: 5000` makes product entries last about 83 minutes instead of 5 seconds. To get 5-second expiry, change it to `ttl: 5`.

- **Installed version:** `package.json` points `quickcache` at `vendor/quickcache`, which is version 2.0.1.
- **Why it's seconds:** its constructor does `this.ttlMs = ttl * 1000`.
- **Checked by running it:** `new QuickCache({ ttl: 5000 })` gives `ttlMs === 5000000`.
- **Why the docs say otherwise:** the saved copy in `docs/vendor/` is for version 1.4.2, where `ttl` was in milliseconds. It's out of date for this repo.

I saved the note at `docs/research/2026-11-11-quickcache-ttl-unit.md`. It starts with `Answer: ttl is in seconds` and follows the layout of the existing note. I haven't changed `src/cache.js`.