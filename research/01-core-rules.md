# 01 · Core rules & principles

Always-on behaviour rules: what the agent must do on every task, regardless of which skill is running.

★ = GitHub stars, read from each repo page on 2026-11-11 (for a skill inside a pack, the whole repo's). Installs = skills.sh all-time installs (`s.sh`) or claude.com/plugins installs (`plugin`) on 2026-11-11; n/a = not listed. Last active = latest commit on the default branch. Score = rubric total out of 45; rubric, candidates and score sheets in [top10-method.md](top10-method.md).

| # | Name | Source | ★ | Installs | Licence | Last active | What it does | Score | Why it ranks here |
|---|---|---|---|---|---|---|---|---|---|
| 1 | verification-before-completion | [obra/superpowers](https://github.com/obra/superpowers/tree/HEAD/skills/verification-before-completion) | 316k | 272k s.sh | MIT | 2026-11-03 | Gate: name the proving command, run it fresh, read output, only then claim | 45/45 | Most checkable always-on rule; kills false "done" claims; covered by the superpowers eval harness |
| 2 | claude-md-management (official) | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official/tree/HEAD/plugins/claude-md-management) | 47k | 287k plugin | Apache-2.0 | 2026-11-10 | Audits CLAUDE.md quality and folds session learnings back into it | 39/45 | Official lessons loop for the rules file; 287k plugin installs |
| 3 | git-guardrails-claude-code | [mattpocock/skills](https://github.com/mattpocock/skills/tree/HEAD/skills/misc/git-guardrails-claude-code) | 321k | 553k s.sh | MIT | 2026-10-31 | Installs a PreToolUse hook that blocks push, reset --hard, clean -f, branch -D | 38/45 | Moves the must-never-slip rule into a hook; 2.3 KB; 553k installs |
| 4 | constraint-driven-development | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills/tree/HEAD/skills/constraint-driven-development) | 115k | 43k s.sh | MIT | 2026-11-01 | Writes CONSTRAINTS.md quality bar; flags diffs that lower it (@ts-ignore, skipped tests) | 37/45 | Turns "do not lower the bar" into a checkable contract; heavy at 22 KB |
| 5 | pstack principle-* (24 principles) | [cursor/plugins](https://github.com/cursor/plugins/tree/HEAD/pstack/skills) | 16k | 5.8k s.sh | MIT (pstack) | 2026-11-11 | One small skill per principle: prove it works, fix root causes, laziness protocol | 37/45 | Best-structured principle set; decisions must cite the principle used. Cursor-specific references need porting |
| 6 | CC Safety Net | [kenryu42/cc-safety-net](https://github.com/kenryu42/cc-safety-net) | 2.0k | 33 s.sh | MIT | 2026-11-11 | Hook that parses shell commands and blocks destructive ops and secret reads | 36/45 | Strongest hook design (parses wrappers, custom rules); small community; README carries a sponsor tracking pixel |
| 7 | Karpathy guidelines (CLAUDE.md) | [multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills/blob/HEAD/CLAUDE.md) | 232k | n/a | MIT | 2026-04-20 | Four rules: think before coding, simplicity, surgical changes, goal-driven verify loops | 35/45 | Tiny drop-in rules file; each rule has a test ("every changed line traces to the request") |
| 8 | using-agent-skills (operating behaviours) | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills/tree/HEAD/skills/using-agent-skills) | 115k | 69k s.sh | MIT | 2026-11-01 | Surface assumptions, push back, enforce simplicity, scope discipline, verify-not-assume | 35/45 | Clear always-on behaviours plus skill routing; repo ships routing evals |
| 9 | caveman | [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman/tree/HEAD/skills/caveman) | 119k | 621k s.sh | Apache-2.0 | 2026-11-09 | Terse-output rules with intensity levels; cuts output tokens | 35/45 | Benchmarked (evals/, arXiv follow-up) cost win; style, not correctness. CLI telemetry on by default |
| 10 | ECC rules (per-language) | [affaan-m/ECC](https://github.com/affaan-m/ECC/tree/HEAD/rules) | 301k | 7.1k s.sh | MIT | 2026-11-06 | Always-loaded coding standards you pick per language | 32/45 | Shows scoping rules per stack; generic standards, heavy harness around it |

**Also considered (11–15):** **Trail of Bits claude-code-config** (31) — Security firm’s production defaults as settings and hooks; **claude-settings-audit (Sentry)** (31) — Concrete audit of the enforcement layer; **Confidence Check (SuperClaude)** (29) — Small idea from an older framework; **agents-md (Sentry)** (29) — Useful generator; **claude-code-infrastructure-showcase** (27) — Hook-driven activation idea.

## Ideas worth stealing
- **Rules are guidance, hooks are enforcement.** Anything that must never slip (no destructive git, run tests before "done") goes in a hook.
- **Testable lines only.** "Write clean code" is useless; "never claim done without running the check" is checkable.
- **Gate function for completion claims** (superpowers): name the command that proves the claim, run it fresh, read the whole output, then claim. "Should pass" is not evidence.
- **Hooks that understand commands** (CC Safety Net) beat regex blocklists: `bash -c`, `xargs`, `env` wrappers and reordered flags slip past simple patterns. The 500-byte mattpocock git-guardrails script is the minimal version.
- **Write the quality bar down** (addyosmani `CONSTRAINTS.md`) and treat any diff that lowers it (new `@ts-ignore`, skipped test, raised threshold) as a finding.
- **Cite the principle you applied** (pstack): makes the rule set auditable and shows which rules never fire.
- **Lessons loop.** After a user correction, write the lesson into a rule file (pstack `correct`, official `claude-md-management` revise step).
- **Security defaults belong in settings** (Trail of Bits config): deny reads of `~/.ssh`, `~/.aws`, `.env`; keep `enableAllProjectMcpServers: false`.
- **Keep each rules file under ~200 lines**; scope extra rules by path so they only load when relevant.
- **Principles as separate small files** (pstack) so skills can cite exactly the one they need.

## H-Stack decision
_Not decided yet._
