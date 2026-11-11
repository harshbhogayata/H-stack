I rewrote `draft.md` as a short engineering note:

```markdown
# Page cache

The caching layer stores rendered pages on disk for 10 minutes. While the database is down, it serves those cached pages. It involves both memory and disk.

In staging, the cache hit rate was 83%.
```

**What I kept:** every fact that can be checked: pages are stored on disk, they expire after 10 minutes, they are served while the database is down, and the staging hit rate was 83%.

**What I cut:** the sentences that stated no fact. That covers "fast-paced landscape", "game-changer", "Experts believe", "The future looks bright", and the general claims that it is "robust, scalable" and gives a "seamless developer experience".

**Decision for you:** the original said only that the cache handles "the interplay of memory and disk". I kept that as "It involves both memory and disk", but the details section only mentions disk storage. If pages are also held in memory, say how and I'll make that sentence specific. If they aren't, the sentence should go. There's no code in the repo to check this against.