I wrote `CLAUDE.md` at the repo root. It's built from the team notes in `CONTRIBUTING.md` and what the code actually contains, and covers four things:

- **Money:** amounts are always integer cents, typed `Cents` from `src/money.ts`. The file points out a catch the team notes don't mention: `Cents` is just another name for `number` (`export type Cents = number`), so the compiler won't stop a fractional value. Agents are told to convert to cents at the boundary and round explicitly when dividing.
- **Migrations:** never edit one that has shipped; add a new one instead.
- **`legacy/`:** frozen except for security fixes.
- **Before pushing:** run both `npm test` and `npm run lint`, because CI runs lint as well.

It leaves out the `dev`, `test` and `lint` script definitions, since agents can read those in `package.json`.

The repo doesn't currently have a `legacy/` folder or any migrations. I kept both rules because they're team policy, but you can drop them if they don't apply to this repo.