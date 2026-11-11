---
name: git-ship
description: Finish branches, write evidence-backed PR bodies, resolve conflicts by intent.
when_to_use: PRs, merge conflicts, worktrees.
user-invocable: false
metadata:
  hstack:
    category: "13"
    short: finish branches, evidence-backed PRs, conflicts by intent
    intents: [pr, merge, branch, worktree, conflict, ship]
    keywords: ["\\b(open|create|write|draft) (a |the )?(pr|pull request)\\b", "\\bpr (body|description)\\b", "\\bmerge conflicts?\\b", "\\bconflict markers?\\b", "\\bworktree\\b", "\\bfinish(ing)? (the |this )?branch\\b", "\\b(squash|rebase) (and|then) merge\\b", "\\bship (it|this)\\b"]
    not_for: []
    events: []
    sizes: [light, full]
    modes: {default: guidance, full_on: []}
    explicit_only: false
    eval: evals/evals.json
    source:
      - {repo: obra/superpowers, path: skills/finishing-a-development-branch, licence: MIT}
      - {repo: obra/superpowers, path: skills/using-git-worktrees, licence: MIT}
      - {repo: mattpocock/skills, path: skills/engineering/pr, licence: MIT}
---

# Git, PRs and shipping

## Gate

For integrating finished work, writing PR bodies, merge conflicts, worktrees and oversized diffs. Reviewing someone's diff is `h-stack:review`. Merges, pushes to the default branch, force pushes, releases and PR or issue comments are irreversible actions: H-Stack asks the user first with the exact command (HS-030), and H-Stack never merges on its own initiative.

## Finishing a branch

1. Run the project's full suite on the tree you are about to integrate. If it fails, report the failures and stop.
2. Confirm the base branch (from the plan, the conversation or the upstream; ask if unsure: merging into the wrong base is expensive to undo).
3. Offer the choices and wait: merge locally into the base, push and open a PR, or keep the branch as is. Discarding work happens only when the user asks for it explicitly, after showing the branch, commits and worktree that would be deleted.
4. Local merge: merge, run the suite on the merged result, and only then remove the branch and the worktree H-Stack created. If the merged result fails, stop with everything in place.
5. PR: push the branch, open the PR with the project's template and conventions (body: see below), report the URL, keep the worktree for review fixes.
6. A rejected push means the remote moved: fetch and investigate; force-push only on the user's explicit request.

Details and clean-up rules: `references/finishing.md`.

## Worktrees

Prefer Claude Code's native worktree support (the `EnterWorktree` tool, `claude --worktree`, or `/batch`) over `git worktree add`, which creates state the harness can't see. Check first whether you are already in a linked worktree. If you fall back to git, use the project's declared worktree directory, else an existing `.worktrees/`, and confirm it is git-ignored. Run the project's setup and its tests for a clean baseline. Details: `references/worktrees.md`.

## PR body: a review guide built from the diff

Reviewers' minutes are the scarce resource. Derive the body from this diff and the project's PR template, not from a fixed layout:
- **What changed**, in the smallest view that makes the point: a short diff sketch, call tree, file tree or pseudocode.
- **Where to look first**: the hunks most likely to be wrong, with a risk note per hunk (logic, data, security, compatibility).
- **Evidence**: before and after (a failing then passing test, output, a screenshot for visual changes), citing the receipts of commands that ran on the final tree.
- **Not verified**: what wasn't checked and why.
- **Merge danger**: one-way or two-way door, and the blast radius.

Use the project's own terms (GLOSSARY.md if present). Keep prose short.

## Merge conflicts

Resolve by intent, not by `--ours`/`--theirs`. For each conflicted hunk, read where each side came from (commit messages, the PR, the issue) so you are choosing between two intents. Keep both where they are compatible; where they aren't, follow the merge's stated goal and name the trade-off. Don't invent new behaviour to hide a clash. Run the project's checks before finishing the merge.

## Change size

Diffs much larger than the project usually merges are hard to review. `node ${CLAUDE_SKILL_DIR}/scripts/change-size.mjs` compares the current diff with the project's recent history and, when it's above the usual size, suggests splitting into stacked steps (each with its own tests).

## CI after the PR

To watch CI for an open PR, use Claude Code's native routes: a Routine with a GitHub-event trigger, or PR activity subscriptions where available. A fix is applied automatically only when the user opted in for that PR; merging stays the user's call.

## Before you finish

- The suite passed on the tree being integrated (cite the receipt).
- PR body: where to look first, evidence, and a "Not verified" section.
- No irreversible git action ran without the user's approval of that exact command.
