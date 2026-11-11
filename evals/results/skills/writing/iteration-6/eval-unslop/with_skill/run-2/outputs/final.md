I rewrote `draft.md` as a short engineering note:

```markdown
# Page cache

The caching layer stores rendered pages and uses both memory and disk. Pages written to disk stay there for 10 minutes. While the database is down, the cache keeps serving those stored pages.

In staging, the cache had an 83% hit rate.
```

All the concrete facts are still there: rendered pages, memory and disk, 10 minutes on disk, served while the database is down, and the 83% staging hit rate.

I cut these because none of them gave a fact:
- **Marketing filler:** "fast-paced landscape", "pivotal enhancement", "seamless developer experience", "cutting-edge techniques", and "robust, scalable, and vibrant".
- **Unsourced claim:** "Experts believe this is a game-changer" names no one.
- **Closing line:** "The future looks bright!"
- **Vague benefit:** "boosts performance" gave no number. The 83% hit rate is the only measurement in the draft, so that stays.

**Decision for you:** the original only hinted at memory, as an "interplay of memory and disk", and its details section mentions only disk. I kept "uses both memory and disk" so no fact was lost. There's no code in the repo to confirm it, so delete that phrase if the cache only uses disk.

I also added a heading, "Page cache", which you can rename or remove.