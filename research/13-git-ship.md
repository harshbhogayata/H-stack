# 13 · Git, PR & shipping

Commits, branches, pull requests, landing, deploying and watching production.

★ = GitHub stars on 2026-11-11 (for a skill inside a pack, the stars are the whole repo's).

| # | Name | Source | ★ | License | What it does | Why it ranks here |
|---|---|---|---|---|---|---|
| 1 | /ship + /land-and-deploy | [garrytan/gstack](https://github.com/garrytan/gstack) | 141k | MIT | Sync, test, audit coverage, push, PR; then merge, wait for CI, verify prod | Most complete release flow |
| 2 | opening-a-pr, babysit, shipping | [cursor/plugins › pstack](https://github.com/cursor/plugins/tree/main/pstack) | 16k (repo) | MIT | Small ordered commits; drive PR to merge-ready; land verified stack bottom-up | Best for stacked PRs |
| 3 | finishing-a-development-branch + using-git-worktrees | [obra/superpowers](https://github.com/obra/superpowers) | 316k | MIT | Isolated worktree per task; merge/PR/keep/discard at the end | Clean branch lifecycle |
| 4 | commit-commands (official) | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) | 47k | Apache-2.0 | Commit, push and PR commands | Official baseline |
| 5 | git-workflow-and-versioning + ci-cd-and-automation | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) | 115k | MIT | Trunk-based, atomic ~100-line commits, quality-gate pipelines | Solid norms |
| 6 | pr | [mattpocock/skills](https://github.com/mattpocock/skills) | 321k | MIT | PR body: smallest visual summary, before/after evidence, merge notes | Best PR-description shape |
| 7 | /modernize | [garrytan/gstack](https://github.com/garrytan/gstack) | 141k | MIT | Rebase a stale PR with range-diff proof, or recommend rework/close | Unique stale-PR handling |
| 8 | /canary | [garrytan/gstack](https://github.com/garrytan/gstack) | 141k | MIT | Post-deploy watch for errors and perf regressions | Ship doesn't end at merge |
| 9 | worktree-cleanup | [cursor/plugins › pstack](https://github.com/cursor/plugins/tree/main/pstack) | 16k (repo) | MIT | Prune merged or abandoned worktrees, safety-gated | Housekeeping for parallel work |
| 10 | changelog-generator | [agensi.io list](https://www.agensi.io/learn/best-claude-code-skills-2026) | ? | ? | Commit range → semver changelog entry | Common need; source not verified |

## Ideas worth stealing
- **Pause before irreversible actions** (force push, deploy, data deletion); everything reversible proceeds.
- **PR bodies show evidence**, not just a description.
- **Stacked PRs landed bottom-up**, each verified independently.
- **Push with a lease pinned to the observed head** when rewriting history.
- **Post-deploy check** as part of "done".

## H-Stack decision
_Not decided yet._
