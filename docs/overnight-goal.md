# Overnight goal prompt

Paste in this session (auto mode) to keep work going unattended. The condition is judged from the conversation, so each step must show its evidence.

```text
/goal Build H-Stack milestones M2–M7 from ARCHITECTURE.md §11 in /home/user/h-stack, following CLAUDE.md (full scope, native-first, adopt-and-adapt, context over templates) and the 10 decisions in ARCHITECTURE.md §12.

Work order: M2 skeleton + CI (HS-010, 011, 012, 015, 045, 081, 083, bin/hs, GitHub Actions CI) → M3 core imports (IM-01, 04, 05, 06 + native config for IM-07, 11, 15; read every upstream file in full, keep LICENSE, THIRD_PARTY.md row with commit + sha256, strip house styles, user-invocable: false, metadata.hstack, evals/evals.json) → M4 activation (HS-017, 018, 020, 022; rules-only classifier per OD-1; spinner per OD-2) → M5 guards (HS-027, 028, 029) → M6 guards (HS-030, 031, 033) → M7 state & memory (HS-046, 048, 049 on native auto memory). Skip M1 baseline and the full smoke test: they need the user's real tasks.

Rules:
- After each milestone: run `node plugins/h-stack/scripts/ci.mjs` and `claude plugin validate .`, show both outputs, then commit and push to origin main. Never force-push, rewrite history or touch other repos.
- Each imported skill: run a light skill-creator benchmark (≥3 eval prompts, 1 run with and 1 without the skill) and record the numbers; drop an import that is worse than no-skill and say why.
- Zero-dependency Node for hooks/scripts. No unpinned installs, no runtime fetching of instructions, no secrets in files.
- If something needs the user (credentials, real tasks, a judgement call not covered by ARCHITECTURE/BACKLOG), write it to MORNING-REPORT.md under "Needs you" and move on; never stop to ask.
- Report honestly: failures and regressions included.

Done when ALL hold, shown in this conversation:
1. M2–M7 items above are implemented, or each one that is not is listed in MORNING-REPORT.md with the exact reason.
2. The final `node plugins/h-stack/scripts/ci.mjs` exits 0 and `claude plugin validate .` passes, both shown.
3. MORNING-REPORT.md exists at the repo root with: what was built per milestone, benchmark numbers per import, CI output summary, deviations from ARCHITECTURE.md, "Needs you" list, and the next steps.
4. `git status` is clean and the last commit is pushed to origin main (show `git log -1 --oneline` and the push result).
Or stop after 80 turns, writing MORNING-REPORT.md and pushing first.
```
