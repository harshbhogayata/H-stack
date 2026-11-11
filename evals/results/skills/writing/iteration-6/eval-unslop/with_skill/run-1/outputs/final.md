I rewrote `draft.md` as a short engineering note. It now reads:

> # Caching layer
>
> The caching layer stores rendered pages on disk for 10 minutes. While the database is down, it keeps serving those pages from the cache. The layer uses memory as well as disk. This note doesn't cover what it keeps in memory.
>
> In staging, the cache hit rate was 83%.

**What's kept:**
- The 10-minute disk cache of rendered pages.
- Serving those pages while the database is down.
- The 83% staging hit rate.
- That the layer uses both memory and disk.

**What's cut:** I removed lines that state no fact: "fast-paced landscape", "game-changer", "seamless developer experience", "robust, scalable, and vibrant" and "The future looks bright!" "Experts believe" was also cut because it names no source.

**Two things to check:**
- **Memory use:** the original only says the cache "delves into the intricate interplay of memory and disk". I took that to mean it uses both, but nothing says what it keeps in memory. If it only uses disk, delete that sentence.
- **Performance:** the original says the cache "boosts performance" but gives no figure. I dropped that claim and left the hit rate as the only measured result. If you have a latency or load number, it belongs in the note.

There's no code in the repo, so I couldn't check any of these claims against an implementation.