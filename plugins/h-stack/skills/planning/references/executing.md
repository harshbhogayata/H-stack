# Executing a plan

Adapted from obra/superpowers `executing-plans` (MIT). The plan already did the thinking: execute it exactly, prove each step with a test you watched fail and then pass, and leave a record that survives compaction.

## Setup

- Work on a branch or worktree, not the default branch, unless the user said otherwise (`h-stack:git-ship` covers worktrees).
- Read the plan once and the spec it names; the spec is the authority when the plan conflicts with it. Create one todo per task.
- Pre-flight: for each task that consumes what an earlier task produces, compare the two Interfaces blocks. Rule on any mismatch now (`hs decide "<ruling>" --why "<spec says…>" --scope "<interface>" --evidence inferred`).
- Progress survives compaction through the plan's checkboxes, `git log`, and H-Stack's checkpoint; after compaction trust those over memory and don't redo tasks whose commits exist.

## Per task

1. Re-read the task's own text (not your memory of it): exact values, signatures, test cases.
2. Work the steps in order under `h-stack:tdd`. A test that passes before the implementation exists is a finding about the test.
3. Each step with an expected output: run it, read it, compare.
   - Matches: next step.
   - The code is wrong: `h-stack:debugging`. Fix the cause, never patch output to match.
   - The plan is wrong (contradicts the spec, an interface doesn't match, a command can't work): make the smallest change that satisfies the spec and record it with `hs decide`.
4. Commit as the plan says.
5. Completion contract: every test the task names exists and ran; the final run for the task passed after its last edit (receipt); every expected output was compared with real output; every deviation has a decision recorded. Then tick the task.

Narrate at most one short line between tool calls; redirect long test output to a file and read its tail.

## Final review

After the last task, get one fresh-context review of the whole branch: the `h-stack:review` skill's blind lane for high-risk diffs, or the built-in `/code-review`. Give the reviewer the plan, the spec and the plan's review focus. Then:
- Re-grade each finding by its effect on a person using the software, not by whether the spec mentioned it.
- Critical and important findings: fix in one pass, each with a test that fails first, then the whole suite.
- Minor findings: list under "Deferred minors"; don't fix them unasked.
- A finding you decide not to fix is a decision: record it.

Then hand over to `h-stack:git-ship` for finishing the branch.

## Stops

Only these stop you: an irreversible or destructive operation, a security-sensitive action, a side effect outside the workspace that norms say to ask about (merge, push to a shared branch, publish), or a plan so broken that every path forward is a guess. Everything else is a decision you make and record.
