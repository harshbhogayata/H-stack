# 07 · Code review & quality

Reviewing a diff for real bugs and quality problems, with low false positives.

★ = GitHub stars on 2026-11-11 (for a skill inside a pack, the stars are the whole repo's).

| # | Name | Source | ★ | License | What it does | Why it ranks here |
|---|---|---|---|---|---|---|
| 1 | code-review (official) | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) | 47k | Apache-2.0 | Parallel reviewer agents, confidence scoring to drop false positives | Anthropic's own PR review approach |
| 2 | pr-review-toolkit (official) | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) | 47k | Apache-2.0 | Specialist reviewers: comments, tests, error handling, types | Good split by concern |
| 3 | requesting- + receiving-code-review | [obra/superpowers](https://github.com/obra/superpowers) | 316k | MIT | Reviewer subagent by severity; weigh feedback before changing code | Covers both sides of review |
| 4 | code-review (Standards × Spec) | [mattpocock/skills](https://github.com/mattpocock/skills) | 321k | MIT | Two parallel axes: repo standards + Fowler smells, and "did it match the spec?" | The spec axis is often missing elsewhere |
| 5 | /review | [garrytan/gstack](https://github.com/garrytan/gstack) | 141k | MIT | Production bugs CI misses; flags weakened tests, timeouts, suppressions | "Gate integrity" check is unique |
| 6 | code-review-and-quality + code-simplification | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) | 115k | MIT | Five-axis review, ~100-line change sizing, severity labels | Clear norms |
| 7 | interrogate + no-comments (comment-sicko) | [cursor/plugins › pstack](https://github.com/cursor/plugins/tree/main/pstack) | 16k (repo) | MIT | Multi-model diff review; strip pointless comments | Multi-model panel idea |
| 8 | Built-in `/code-review` | Claude Code | — | — | Effort levels, `--fix`, `--comment` on PRs | Already available, no install |
| 9 | code-review-skill | [awesome-skills/code-review-skill](https://github.com/awesome-skills/code-review-skill) | 2.2k | MIT | Per-language guides loaded on demand; blocking/important/nit labels | Progressive loading pattern |
| 10 | 9 parallel review agents | [HAMY write-up](https://hamy.xyz/blog/2026-02_code-reviews-claude-subagents) | — | — | Scope detection + 9 reviewers in parallel, synthesised | Good scope-detection rules |

## Ideas worth stealing
- **Verify each finding** before reporting it (a second agent tries to refute it).
- **Review against the spec**, not just against style.
- **Flag weakened gates:** skipped tests, raised timeouts, new lint suppressions.
- **Scope detection order:** user-given → branch diff → staged → last commit.
- **A `REVIEW.md`** in the repo for review-only rules, separate from CLAUDE.md.

## H-Stack decision
_Not decided yet._
