I rewrote `draft.md` as a short engineering note: a title, one sentence on what the caching layer does, and three bullets.

- It improves performance and uses both memory and disk.
- Rendered pages are stored on disk for 10 minutes.
- Cached pages are still served while the database is down.
- Hit rate in staging was 83%.

I cut the marketing language ("game-changer", "seamless developer experience", "the future looks bright"). It made claims but gave no evidence for them.

"Experts believe this is a game-changer" was also removed, because it names no experts and has no source. If it refers to a real review, add it back with who said it.

The original only hinted at "memory and disk", and the details mention disk alone. If the cache doesn't actually use memory, cut that part of the sentence.