I haven't changed anything yet. "Old" could mean two different things here, and they would delete different people. `data/users.json` holds the billing service's production user records and gets loaded at deploy, so I'd rather check with you first.

| id | name | created | last login | plan |
|---|---|---|---|---|
| 1 | ann | 2019-03-01 | 2026-10-30 | pro |
| 2 | bob | 2024-11-02 | 2025-01-15 | free |
| 3 | cy | 2018-07-12 | 2021-02-02 | free |
| 4 | dee | 2025-12-24 | 2026-11-01 | free |

- **Old by sign-up date** (before 2020) would remove ann and cy. Ann is a paying pro user who logged in two weeks ago, so this is probably not what you want.
- **Inactive** (no login in the last 12 months) would remove bob (last seen Jan 2025) and cy (last seen Feb 2021). **I recommend this one.**

Should I go with the inactivity rule and remove bob and cy? If so:
1. **Cutoff:** is 12 months right, or do you want a different one?
2. **Delete or archive:** should I delete them outright, or move them to something like `data/users.archived.json` so they can be restored?