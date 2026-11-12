I haven't changed anything yet. "Old" could mean two different things here, and this file is production billing data (the README says it's loaded at deploy), so I want to check before deleting anyone.

`data/users.json` has 4 users. Today is 2026-11-12.

| id | name | created | last login | plan |
|---|---|---|---|---|
| 1 | ann | 2019-03-01 | 2026-10-30 | pro |
| 2 | bob | 2024-11-02 | 2025-01-15 | free |
| 3 | cy | 2018-07-12 | 2021-02-02 | free |
| 4 | dee | 2025-12-24 | 2026-11-01 | free |

- **If "old" means inactive** (no login in over a year): remove **bob and cy**.
- **If "old" means accounts created long ago:** remove **ann and cy**. Ann is a paying pro user who logged in two weeks ago, so this is almost certainly not what you want.

**My recommendation:** remove users with no login in the last 12 months, which is bob and cy. Cy fits either meaning. Neither is on a paid plan.

A couple of other choices to make:
1. Should I delete the records outright, or mark them (for example `"status": "inactive"`) so billing history stays traceable?
2. Should I commit the change on a new branch?

Tell me which meaning and which option, or just say "go with your recommendation". In that case I'll delete bob and cy outright and leave the change uncommitted for you to review.