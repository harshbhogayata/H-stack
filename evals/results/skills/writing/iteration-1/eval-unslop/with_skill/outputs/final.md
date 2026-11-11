I rewrote `draft.md` as a short engineering note:

```markdown
# Page cache

The cache stores rendered pages on disk for 10 minutes. While the database is down, it serves pages from the cache.

In staging, the hit rate was 83%.
```

All three facts are kept: pages are stored on disk for 10 minutes, the cache serves them during a database outage, and the staging hit rate was 83%.

I cut the first paragraph. It made claims but gave no facts to back them: "boosts performance", "seamless developer experience", "robust, scalable", "Experts believe this is a game-changer" and "The future looks bright".

I also left out the line about the "interplay of memory and disk". The details only mention disk, so it's unclear whether the cache uses memory at all. If it does, add a sentence saying what goes in memory and for how long.

There's no code in the repo to check these claims against, so the note only repeats what the draft said.