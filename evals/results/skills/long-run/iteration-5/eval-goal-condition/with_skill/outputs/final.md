I wrote `features.json`, plus a checker script `check.mjs` and a `progress.md` for the run to keep notes in. `todo.js` doesn't exist yet, and I didn't implement any of it.

## What's in the repo now (not committed)

- **`features.json`**: one entry per item in SPEC.md, each starting at `"passes": false` with its own check command:
  - **F1**: `add "x"` adds x to the end of `todos.json` and prints `added: x`. Check: `node check.mjs F1`
  - **F2**: `list` prints the todos numbered from 1. Check: `node check.mjs F2`
  - **F3**: `done 1` removes item 1, prints `done: <text>`, and the remaining items are numbered from 1 again. Check: `node check.mjs F3`
- **`check.mjs`**: runs each check on a temporary copy of `todo.js` with an empty `todos.json`, so the real `todos.json` stays `[]`. Its last line is `RESULT: n/3 PASS`, and it exits with code 0 only when all three pass.
- **`progress.md`**: a running log for the agent, with decisions made and anything blocked.

**Testing the checker:** right now it reports `RESULT: 0/3 PASS` with a non-zero exit, because `todo.js` is missing. Against a throwaway correct implementation, which I've since deleted, it reported `3/3 PASS` with exit 0. I also tried to confirm it catches a wrong output message, but the sandbox blocked that command, so that test didn't run. F3 does compare the output against `done: alpha` exactly.

**Two places where SPEC.md isn't specific, and what I chose:**
- SPEC.md doesn't say how a `list` line should look. The check accepts the number, then any separator, then the text (for example `1. alpha`).
- Items in `todos.json` can be plain strings or objects with a `text` field.

If you want a stricter format, change `check.mjs` before starting the run.

## The `/goal` condition to paste

```
/goal Implement SPEC.md in todo.js (Node, no new dependencies). Done only when `node check.mjs` exits 0 with last line exactly "RESULT: 3/3 PASS" on a run made after your final edit, AND `sha256sum check.mjs SPEC.md` still prints 0971e5b1a34d5aa03a64d6d4e837c04c997c9530c6783133bee69efb3e6367b3 for check.mjs and aefac0027d48b0d89c7f0168f07a2b9c48f0a48ad785c6243f65e0377ab4c05d for SPEC.md, AND every feature in features.json has "passes": true, AND todos.json in the repo is still []. Each round: read features.json, progress.md and git log first; work on one failing feature; run `node check.mjs <id>`; set passes=true only after that check passes following the last edit to todo.js; add a line to progress.md. Constraints: edit only todo.js, features.json (passes field only) and progress.md; never edit check.mjs or SPEC.md; no force-push, no history rewrites, no pushing to remotes. If the same check fails the same way for 3 rounds in a row, record it under "Blocked" in progress.md and move to the next feature. Stop after 40 turns at most. In the final message, paste the full output of `node check.mjs` and the sha256sum line as proof.
```

Before you start it, commit `check.mjs`, `features.json` and `progress.md`. That gives a clean starting point to compare against. The sha256 hashes in the condition also catch any edit to the checker or the spec, whether or not you commit.