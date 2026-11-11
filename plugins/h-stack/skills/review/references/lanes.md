# Blind review lanes for high-risk diffs (HS-061, HS-062, HS-063)

Same-family reviewers grade leniently (self-preference ×1.7–1.8), and "nothing found" can't be told from "not checked". Lanes address both.

1. **Pick axes from the risk**, two to four: correctness, security, data integrity, concurrency, API compatibility, performance. Don't run every axis on every diff.
2. **Dispatch one `h-stack:review-lane` subagent per axis**, in parallel, each with only: the diff command (`git diff <base>...HEAD`), its axis, the spec or rubric path, and the repo's own review rules (REVIEW.md, CLAUDE.md, lint config). Not your reasoning about the change.
3. **Validation is mechanical.** H-Stack checks each lane's JSON (schema, three verdicts, cited file and line exist, quoted snippet is at that line). Malformed output is discarded and the lane re-run fresh, never repaired. A lane with no findings and fewer than three `cleared` units is thin and gets re-run from another angle.
4. **Judge pass.** Re-check every confirmed or plausible finding against the same rules yourself or with one more fresh subagent; if the project configured a second model family (OD-7), use it here.
5. **Report** confirmed and plausible findings with evidence, the rejected ones in one line each, the union of `cleared` units and every `not_reviewed` unit. The user makes the merge call; a lane is never the only gate.

## Calibration from overrides (HS-064)

When the user overrides a finding ("that's fine, it's intentional"; "you missed X"), record it with `hs review-override "<finding summary>" --verdict false-positive|missed --why "<reason>"`. The last few overrides for this project are added to lane briefs as calibration examples. Keep an example only if the skill benchmark with it is at least as good as without.
