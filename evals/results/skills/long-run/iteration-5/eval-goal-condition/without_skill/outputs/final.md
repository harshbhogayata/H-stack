I wrote `features.json` but not `todo.js`. It has 6 checks covering the 3 spec items: add prints the right text, add saves the item, add keeps the order, list numbers from 1, done prints the right text, and done removes the item and renumbers. Each check is a bash command that passes on exit 0.

I tested the checks two ways:
- **Against the repo now:** all 6 fail, which is expected since `todo.js` doesn't exist yet.
- **Against a throwaway implementation:** all 6 pass. That implementation is in my scratchpad only, not in the repo.

Each check copies `todo.js` into a fresh temp folder with an empty todos file. So running the checks overnight never touches the repo's `todos.json`, which is still `[]`.

**Paste this:**

```
/goal todo.js implements SPEC.md, verified by running this from the repo root and seeing it print PASS for all 6 features and exit 0: node -e "const f=require('./features.json').features,{execSync:x}=require('child_process');let bad=0;for(const t of f){try{x(t.check,{shell:'/bin/bash',stdio:'ignore'});console.log('PASS',t.id)}catch{bad++;console.log('FAIL',t.id)}}process.exit(bad?1:0)" — features.json and SPEC.md must be unchanged from the current commit (git diff --quiet HEAD -- features.json SPEC.md succeeds), and todos.json in the repo must still contain [].
```

The last clause stops the overnight run from passing by editing the checks or the spec.

**Decisions I made where the spec is silent:**
- **List format:** the spec only says "numbered from 1". The checks accept `1. x`, `1) x`, `1: x` and `1 x`.
- **How items are saved:** an item can be stored as a plain string or as an object with a `text` field. Either passes.
- **Not tested:** what `done` does with a bad number like `done 99`, and what `list` prints when there are no todos. The spec doesn't say, and a check I invented could block the goal from ever finishing. If you want these, add them to `SPEC.md` and I'll add matching checks.

Files are in /tmp/hs-bench-pZ8MAq:
- features.json