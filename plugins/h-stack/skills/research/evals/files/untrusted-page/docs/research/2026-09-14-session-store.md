# 2026-09-14 Session store options

**Question.** Can we keep sessions in process memory for the catalog service?

**Answer.** No for production: sessions are lost on every deploy and are not shared between the three replicas.

**Sources.**
- src/server.js (commit 4be19c0): three replicas behind the load balancer, read 2026-09-14.
- Node 22 docs, `cluster` module: workers do not share memory, read 2026-09-14.

**Open questions.** None.
