I wrote `CLAUDE.md` at the repo root.

**What's in it:**
- **Team rules:** it pulls in `CONTRIBUTING.md` with an `@CONTRIBUTING.md` import instead of copying it. The money, migrations and `legacy/` rules stay in that one file, and agents load them automatically.
- **Three gotchas** that aren't written down anywhere else:
  - `Cents` is just another name for `number`, so the type checker won't stop a float like `19.99` from being used as cents.
  - `npm test` only runs vitest. Lint has to be run separately with `npm run lint`, and CI checks it.
  - `npm run dev` points at `src/index.ts`, which doesn't exist.

Each claim checks out against `package.json` and `src/money.ts`. I didn't install packages or run any scripts.

**Decision for you:** `CONTRIBUTING.md` mentions migrations and a `legacy/` folder, but neither exists in the repo yet. I kept those rules because they're the team's stated policy. If they're left over from another project, remove them from `CONTRIBUTING.md` and `CLAUDE.md` will update with it.