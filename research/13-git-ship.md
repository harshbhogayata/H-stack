# 13 · Git, PR & shipping

Commits, branches, pull requests, landing, deploying and watching production.

★ = GitHub stars, read from each repo page on 2026-11-11 (for a skill inside a pack, the whole repo's). Installs = skills.sh all-time installs (`s.sh`) or claude.com/plugins installs (`plugin`) on 2026-11-11; n/a = not listed. Last active = latest commit on the default branch. Score = rubric total out of 45; rubric, candidates and score sheets in [top10-method.md](top10-method.md).

| # | Name | Source | ★ | Installs | Licence | Last active | What it does | Score | Why it ranks here |
|---|---|---|---|---|---|---|---|---|---|
| 1 | finishing-a-development-branch + using-git-worktrees | [obra/superpowers](https://github.com/obra/superpowers/tree/HEAD/skills/finishing-a-development-branch) | 316k | 229k s.sh | MIT | 2026-11-03 | Isolated worktree per task; verify tests; merge/PR/keep/discard | 39/45 | Clean branch lifecycle; eval-covered |
| 2 | resolving-merge-conflicts | [mattpocock/skills](https://github.com/mattpocock/skills) | 321k | 551k s.sh | MIT | 2026-10-31 | Read intent of both sides, resolve every hunk, run checks, finish | 38/45 | Short, concrete; 551k installs (skills.sh Snyk audit: Warn) |
| 3 | pr | [mattpocock/skills](https://github.com/mattpocock/skills/tree/HEAD/skills/engineering/pr) | 321k | 240k s.sh | MIT | 2026-10-31 | PR body: smallest visual summary, before/after evidence, merge notes | 36/45 | Best PR-description shape |
| 4 | commit-commands (official) | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official/tree/HEAD/plugins/commit-commands) | 47k | 171k plugin | Apache-2.0 | 2026-11-10 | /commit, /commit-push-pr, /clean_gone | 36/45 | Official baseline; thin |
| 5 | /ship + /land-and-deploy (gstack) | [garrytan/gstack](https://github.com/garrytan/gstack/tree/HEAD/ship) | 141k | 440 s.sh | MIT | 2026-11-10 | Sync, test, coverage audit, push, PR; merge, wait for CI, verify prod | 35/45 | Most complete release flow; 61 KB |
| 6 | opening-a-pr, babysit, shipping (pstack) | [cursor/plugins](https://github.com/cursor/plugins/tree/HEAD/pstack/skills/poteto-mode/playbooks) | 16k | 5.1k s.sh | MIT (pstack) | 2026-11-11 | Ordered commits; drive PR to merge-ready; land verified stack bottom-up | 34/45 | Best for stacked PRs; "green is not safe" verdict per PR |
| 7 | shipping-and-launch | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills/tree/HEAD/skills/shipping-and-launch) | 115k | 68k s.sh | MIT | 2026-11-01 | Pre-launch checklist, staged rollout thresholds, rollback | 34/45 | Best launch checklist |
| 8 | ce-commit-push-pr | [EveryInc/compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin/tree/HEAD/skills/ce-commit-push-pr) | 26k | 3.5k s.sh | MIT | 2026-11-11 | Commit, push, PR with description from the work | 34/45 | Solid |
| 9 | deploy-to-vercel | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) | 34k | 189k s.sh | MIT | 2026-10-27 | Deploy and manage Vercel projects | 34/45 | Platform-specific |
| 10 | GitHub MCP (official plugin) | [github/github-mcp-server](https://github.com/github/github-mcp-server) | 34k | 319k plugin | MIT | 2026-11-09 | Issues, PRs, reviews via GitHub API | 33/45 | Tooling; many tools |

**Also considered (11–15):** **claude-code-action** (33) — CI integration; **/canary (gstack)** (32) — Ship does not end at merge; **iterate-pr + commit + pr-writer (Sentry)** (32) — Production use at Sentry; **/modernize (gstack)** (32) — Unique; **loop-on-ci / fix-ci (cursor-team-kit)** (32) — Small.

## Ideas worth stealing
- **Pause before irreversible actions** (force push, deploy, data deletion); everything reversible proceeds.
- **PR bodies show evidence**, not just a description.
- **Merge conflicts:** read the intent of both sides from history, resolve every hunk, run the checks, always finish (mattpocock `resolving-merge-conflicts`).
- **Verify tests on the merged result** and detect the environment before cleaning up a worktree (superpowers).
- **Green is not safe:** independent per-PR verdict before landing a stack, bottom-up (pstack shipping).
- **Iterate a PR until CI and review comments are resolved** (Sentry `iterate-pr`).
- **Push with a lease pinned to the observed head** when rewriting history.
- **Staged rollout thresholds and a rollback plan** (addyosmani `shipping-and-launch`), then a **post-deploy check** as part of "done".

## H-Stack decision
_Not decided yet._
