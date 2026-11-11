No, the entries don't expire after 5 seconds. The installed quickcache (version 2.0.1, in `vendor/quickcache`) treats `ttl` as seconds, so `ttl: 5000` keeps product entries for 5000 seconds, about 83 minutes.

- **Source:** the constructor in `vendor/quickcache/index.js` does `this.ttlMs = ttl * 1000`.
- **Test:** I loaded the installed module with `ttl: 5000` and a fake clock. An entry was still there 6 seconds after it was stored and was only gone after 5000 seconds.
- **Why the docs disagree:** the saved copy in `docs/vendor/quickcache-docs.html` is for version 1.4.2, where `ttl` is in milliseconds. That doesn't apply to 2.0.1, whose README gives no unit. `src/cache.js` was most likely written from those 1.4 docs. That part is my inference, since no changelog is included.

To get 5 seconds with this version, change it to `ttl: 5`. I haven't changed `src/cache.js`.

Still open: why the unit changed in 2.0 (no changelog to check), and I didn't look at the online docs.

The note starts with `Answer: ttl is in seconds` and is saved at `docs/research/2026-11-11-quickcache-ttl-unit.md`, laid out like the existing session-store note.