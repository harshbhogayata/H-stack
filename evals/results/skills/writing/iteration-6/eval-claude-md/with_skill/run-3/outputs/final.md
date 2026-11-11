I added `CLAUDE.md` at the repo root. It's short because the repo is small: `package.json`, `CONTRIBUTING.md`, and a one-line `src/money.ts`.

**What it covers:**
- **Money:** every amount is integer cents and uses the `Cents` type. The file also warns about a gap I found in the code: `Cents` is just another name for `number`, so the compiler will accept a float without complaint. It tells agents to round wherever division or percentages are involved.
- **Migrations:** a migration that has shipped is never edited; schema changes go in a new one.
- **`legacy/`:** frozen apart from security fixes.
- **Done check:** `npm test` and `npm run lint` must both pass, since CI runs lint as well as tests.

I left out the dev, test and lint commands because `package.json` already lists them. A copy in `CLAUDE.md` could fall out of date.

**Something to check:** `CONTRIBUTING.md` mentions a `legacy/` folder and migrations, but neither exists in this checkout. I kept those rules because they come from the team. If those parts have been removed, delete the two lines.

I ran nothing: there's no lint config or test file in the repo to try. I didn't commit.