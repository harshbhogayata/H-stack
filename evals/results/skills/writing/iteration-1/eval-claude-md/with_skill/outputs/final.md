I wrote `CLAUDE.md` at the repo root. It's short, because the repo itself is small: `CONTRIBUTING.md`, `package.json` and a one-line `src/money.ts`. I left out the commands, since the agent can read them from `package.json`, and kept only the team rules that no file enforces:

- **Money:** always integer cents, using the `Cents` type in `src/money.ts`. I added one warning: `Cents` is just another name for `number`, so the compiler won't stop a fractional value. The file says to round after any division or percentage.
- **Migrations:** once a migration has shipped, don't edit it; add a new one.
- **`legacy/`:** frozen; only security fixes go in.
- **Before pushing:** `npm test` and `npm run lint` must both pass, since CI runs lint too.

Some of what `CONTRIBUTING.md` describes isn't in the repo yet, so you may want to fix the code or drop those lines:
- There is no `legacy/` folder and no migrations directory. I kept those two rules because the team set them, but for now they don't apply to anything.
- The `dev` script runs `src/index.ts`, and that file doesn't exist, so `npm run dev` will fail as things stand.