No, the cache doesn't do that. In the quickcache version installed here (2.0.1), `ttl` is in **seconds**, so `ttl: 5000` makes product entries last 5,000 seconds, about 83 minutes, instead of 5 seconds.

- **The code:** the constructor in `vendor/quickcache/index.js` multiplies `ttl` by 1000. I ran it with `ttl: 5000` and new entries were set to expire 5,000,000 ms later.
- **The saved docs:** they say milliseconds, but they're for version 1.4.2, saved in 2024. The unit seems to have changed in version 2, and the vendored README doesn't name a unit.
- **Fix:** change `src/cache.js` to `ttl: 5`. I haven't changed it.

The note starts with `Answer: ttl is in seconds` and follows the format of the existing note. It also records that no changelog is vendored, so I couldn't confirm which release changed the unit.

Files are in docs/research:
- 2026-11-11-quickcache-ttl-unit.md