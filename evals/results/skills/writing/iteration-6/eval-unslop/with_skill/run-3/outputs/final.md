I rewrote `draft.md` as a plain engineering note:

> The caching layer stores rendered pages on disk for 10 minutes, so repeat requests skip rendering. While the database is down, it serves those stored pages instead of failing.
>
> In staging, the cache hit rate was 83%.

All the measurable facts are still there: pages are stored on disk, they're kept for 10 minutes, they're served while the database is down, and the staging hit rate was 83%.

I removed three claims from the first paragraph because nothing in the draft supports them. Tell me if you want any of them back with numbers or a source:

- **"Boosts performance" and "seamless developer experience":** the draft gives no measurement. The closest I kept is "repeat requests skip rendering", which is simply what caching rendered pages does. If you have a latency figure, it would fit there.
- **"Interplay of memory and disk":** the details only mention disk. If the cache also has an in-memory layer, that's a real fact and should be stated directly.
- **"Experts believe this is a game-changer":** no expert is named, so I cut it. "The future looks bright" also went, since it says nothing about the cache.

There were no other docs in the repo to match a house style against, so I used sentence case and no heading.