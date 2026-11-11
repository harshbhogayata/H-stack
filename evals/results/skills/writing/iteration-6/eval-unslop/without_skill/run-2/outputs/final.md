I rewrote `draft.md` as a short engineering note. It keeps the three concrete facts: rendered pages are stored on disk for 10 minutes, cached pages are served while the database is down, and the staging hit rate was 83%.

I cut these lines because there was nothing in them to check:
- **"Boosts performance" and "seamless developer experience":** the draft gave no numbers to back them. The 83% hit rate is the only measurement, and it's kept.
- **"Experts believe this is a game-changer":** no source was named.
- **"Robust, scalable, vibrant" and "The future looks bright!":** filler, no facts in them.
- **"Interplay of memory and disk":** the details only mention disk, so I left memory out rather than guess. If the cache also uses memory, tell me how and I'll add a line.