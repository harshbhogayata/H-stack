I wrote `features.json` and `progress.md` in the repo and left them uncommitted. I didn't touch `todo.js` or `todos.json`.

**What's in `features.json`:** four features, each with a shell check (exit code 0 means pass) and `"passes": false`.

| id | Spec item | What the check proves |
|---|---|---|
| F1-add-prints | 1 | `add 'alpha one'` prints exactly `added: alpha one` |
| F2-add-appends-and-persists | 1 | Two adds leave a valid JSON array of 2 items, in order |
| F3-list-numbered-from-1 | 2 | `list` prints exactly 2 lines: `1…alpha one`, then `2…bravo two` |
| F4-done-removes-and-prints | 3 | `done 1` prints `done: alpha one`, removes it from the file, and `bravo two` becomes item 1 |

Each check copies `todo.js` into a fresh temp folder with `todos.json` reset to `[]`, so the repo's `todos.json` stays as it is.

**Testing the checks:**
- In the repo now, with no `todo.js`, the result is 0/4.
- Against a small throwaway `todo.js` I wrote in the scratchpad, it's 4/4.
- With that same file changed to number the list from 0, it's 2/4: F3 and F4 fail, as they should.

**Decisions I made where the spec is vague:**
- **List format:** any number-then-text form passes (`1. x`, `1) x`, `1 x`).
- **How items are stored:** strings and objects both pass.
- **Not checked:** what `list` does with no todos, and what `done` does with a bad index. These are listed as open questions in `progress.md`.

**The /goal condition to paste:**

```
/goal Implement SPEC.md in todo.js. Done means this command, run from the repo root after your last edit to todo.js, exits 0 and prints "4/4 passing":
node -e 'const f=require("./features.json"),{execSync}=require("child_process"),h=require("crypto").createHash("sha256").update(JSON.stringify(f.features.map(x=>x.check))).digest("hex");if(h!=="4fbf84442cd8b2fea3f35f0977b4710452302375c51e5308a5235ea368756daa"){console.log("CHECKS MODIFIED");process.exit(2)}let n=0;for(const x of f.features){try{execSync(x.check,{shell:"/bin/bash",stdio:"ignore"});n++;console.log("PASS",x.id)}catch{console.log("FAIL",x.id)}}console.log(n+"/"+f.features.length+" passing");process.exit(n===f.features.length?0:1)'
To finish, commit todo.js and features.json, then quote that command's full output and the commit sha. Each round: read features.json, progress.md and git log first. Flip a feature's "passes" to true only after its check passes following the latest edit. Add one line per round to the Log in progress.md.
Constraints: do not edit any "check" field in features.json, SPEC.md or the committed todos.json (the hash guard catches edited checks). No force-push, no history rewrites, no new dependencies. Call something blocked only after it stays the same for 3 rounds; then record it under Blocked in progress.md and move on. Stop after 30 turns even if not done, and report N/4 plus what's blocked.
```

Before you start the run, commit `features.json` and `progress.md` so the overnight agent works from them in git history. The H-Stack helper steps (`hs goal set`, receipts) were skipped as you said, so the condition uses the commit sha as the proof to cite.