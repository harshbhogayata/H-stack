# 07 · Code review & quality

Reviewing a diff for real bugs and quality problems, with low false positives.

★ = GitHub stars, read from each repo page on 2026-11-11 (for a skill inside a pack, the whole repo's). Installs = skills.sh all-time installs (`s.sh`) or claude.com/plugins installs (`plugin`) on 2026-11-11; n/a = not listed. Last active = latest commit on the default branch. Score = rubric total out of 45; rubric, candidates and score sheets in [top10-method.md](top10-method.md).

| # | Name | Source | ★ | Installs | Licence | Last active | What it does | Score | Why it ranks here |
|---|---|---|---|---|---|---|---|---|---|
| 1 | code-review (official) | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official/tree/HEAD/plugins/code-review) | 47k | 439k plugin | Apache-2.0 | 2026-11-10 | Parallel CLAUDE.md and bug agents; each issue re-validated before posting | 42/45 | Validation step plus explicit false-positive list; 439k installs |
| 2 | code-review (Standards × Spec) | [mattpocock/skills](https://github.com/mattpocock/skills/tree/HEAD/skills/engineering/code-review) | 321k | 880k s.sh | MIT | 2026-10-31 | Two parallel axes: repo standards + Fowler smells, and "did it match the spec?" | 40/45 | Only reviewer with a spec axis kept separate; 880k installs |
| 3 | requesting- + receiving-code-review | [obra/superpowers](https://github.com/obra/superpowers/tree/HEAD/skills/receiving-code-review) | 316k | 278k s.sh | MIT | 2026-11-03 | Reviewer subagent by severity; verify feedback before changing code | 40/45 | Covers both sides of review; eval-covered |
| 4 | Built-in /code-review | [docs](https://code.claude.com/docs/en/slash-commands) (built-in) | n/a | built-in | n/a (built-in) | built-in | Effort levels, --fix, --comment, max findings | 39/45 | Built-in; no install |
| 5 | ce-code-review | [EveryInc/compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin/tree/HEAD/skills/ce-code-review) | 26k | 4.0k s.sh | MIT | 2026-11-11 | Many reviewer personas, findings merged and de-duplicated | 38/45 | Rigorous; small installs |
| 6 | pr-review-toolkit (official) | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official/tree/HEAD/plugins/pr-review-toolkit) | 47k | 115k plugin | Apache-2.0 | 2026-11-10 | Specialist agents: silent failures, tests, comments, types, simplification | 37/45 | Good split by concern |
| 7 | /review (gstack) | [garrytan/gstack](https://github.com/garrytan/gstack/tree/HEAD/review) | 141k | 497 s.sh | MIT | 2026-11-10 | Production bugs CI misses; flags weakened tests, raised timeouts, new suppressions | 35/45 | "Gate integrity" check is unique; 60 KB |
| 8 | code-review-and-quality | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills/tree/HEAD/skills/code-review-and-quality) | 115k | 85k s.sh | MIT | 2026-11-01 | Five-axis review, ~100-line sizing, tests first, severity labels | 34/45 | Clear norms; 21 KB |
| 9 | thermo-nuclear-code-quality-review | [cursor/plugins](https://github.com/cursor/plugins/tree/HEAD/cursor-team-kit/skills/thermo-nuclear-code-quality-review) | 16k | 24k s.sh | MIT (pstack) | 2026-11-11 | Strict maintainability review: 1k-line file cap, spaghetti growth, "code judo" | 34/45 | Concrete structural rules; user-invoked only |
| 10 | interrogate + no-comments (pstack) | [cursor/plugins](https://github.com/cursor/plugins/tree/HEAD/pstack/skills/interrogate) | 16k | 5.4k s.sh | MIT (pstack) | 2026-11-11 | Multi-model adversarial diff review; strip pointless comments | 33/45 | Multi-model panel idea |

**Also considered (11–15):** **code-simplification (addy)** (32) — Cleanup, not review; **Greptile (greploop)** (32) — Service-backed loop; **CodeRabbit skills** (31) — Service-backed; **claude-code-action** (31) — CI integration, not a method; **caveman-review** (31) — Format, not finding method.

## Ideas worth stealing
- **Verify each finding** before reporting it: a separate agent re-checks each flagged issue and only validated ones are posted (official `code-review`).
- **Write down the false-positive list:** pre-existing issues, linter-catchable issues, pedantic nits, issues silenced in code.
- **Review against the spec**, not just against style, and keep the two axes separate without re-ranking across them (mattpocock).
- **Flag weakened gates:** skipped tests, raised timeouts, new lint suppressions.
- **Structural thresholds** (thermo-nuclear review: a file crossing 1,000 lines needs a reason).
- **Receiving review:** check that feedback is correct before changing code; no performative agreement (superpowers).
- **Scope detection order:** user-given → branch diff → staged → last commit.
- **A `REVIEW.md`** in the repo for review-only rules, separate from CLAUDE.md.

## H-Stack decision
_Not decided yet._
