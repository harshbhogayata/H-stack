I rewrote `draft.md` as a short engineering note. It keeps all the concrete facts: rendered pages are stored on disk for 10 minutes, cached pages are still served when the database is down, staging showed an 83% hit rate, and the layer is meant to improve performance.

I removed these lines because they claim nothing that can be checked:
- **"Experts believe this is a game-changer" and "The future looks bright!"** No source or evidence is given.
- **"Fosters a seamless developer experience."** Nothing in the draft supports it.
- **"Interplay of memory and disk."** The details only describe a disk cache. If there's also an in-memory tier, it should go back in as a concrete statement, such as how big it is and how long entries live.