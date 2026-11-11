# Overnight goal prompt (full H-Stack)

Paste in a session on this repo (auto mode) to build unattended. The condition is judged from the conversation, so each step must show its evidence.

```text
/goal Build the FULL H-Stack in this repository: every item in BACKLOG.md (HS-001 to HS-085, all of P0, P1 and P2) and every row of its IM imports table, following CLAUDE.md, ARCHITECTURE.md and the accepted decisions in ARCHITECTURE.md §12. Read CLAUDE.md, ARCHITECTURE.md, BACKLOG.md and the relevant research/ files first.

Order: P0 milestones M2 → M8 from ARCHITECTURE.md §11 (skip the M1 baseline run: it needs the user's real tasks), then every P1 item, then every P2 item, following backlog dependencies. Prepare M9 (release gate, README, v1.0 report) with everything except the smoke-test numbers.

Only these may be left undone, and only with the exact reason: the user's real smoke-test tasks and their results (M1 and the M9 numbers), credentials or accounts, visual checks inside the user's desktop app, and judgement calls not covered by ARCHITECTURE.md or BACKLOG.md. Everything else must be built.

Rules:
- Add a Status line to every HS item and IM row in BACKLOG.md: done / needs-user (reason) / dropped (evidence). Keep it current.
- After each milestone and after every ~5 backlog items: run `node plugins/h-stack/scripts/ci.mjs` and `claude plugin validate .`, show both outputs, then commit and push to origin main. Never force-push, rewrite history or touch other repos.
- Imports: read every upstream file in full, keep LICENSE, add a THIRD_PARTY.md row with commit and sha256, strip house styles (context over templates), set user-invocable: false, add metadata.hstack and evals/evals.json, and run a light skill-creator benchmark (≥3 eval prompts, 1 run with and 1 without). Drop an import that is worse than no-skill and say why.
- Zero-dependency Node for hooks and scripts. No unpinned installs, no runtime fetching of instructions, no secrets in files.
- Anything that needs the user goes in MORNING-REPORT.md under "Needs you"; never stop to ask.
- Report honestly, failures and regressions included.

Done when ALL hold, shown in this conversation:
1. A script prints the BACKLOG.md status counts (done / needs-user / dropped) and shows 0 HS items and 0 IM rows without a status, and no item is needs-user for a reason outside the allowed list above.
2. The final `node plugins/h-stack/scripts/ci.mjs` exits 0 and `claude plugin validate .` passes, both shown.
3. MORNING-REPORT.md exists at the repo root with: what was built per milestone and per priority, benchmark numbers per import, CI summary, deviations from ARCHITECTURE.md, the "Needs you" list, and next steps.
4. `git status` is clean and the last commit is pushed to origin main (show `git log -1 --oneline` and the push result).
Or stop after 300 turns, writing MORNING-REPORT.md and pushing first.
```
