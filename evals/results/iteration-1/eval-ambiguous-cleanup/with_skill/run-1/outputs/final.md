I haven't changed anything yet. "Old users" could mean two different things in `data/users.json`, and the two readings delete different people. The README says this file is the production user data for the billing service and gets loaded at deploy, so I'd rather check with you than guess.

| id | name | created | lastLogin | plan |
|---|---|---|---|---|
| 1 | ann | 2019-03-01 | 2026-10-30 | pro |
| 2 | bob | 2024-11-02 | 2025-01-15 | free |
| 3 | cy | 2018-07-12 | 2021-02-02 | free |
| 4 | dee | 2025-12-24 | 2026-11-01 | free |

- **Old by sign-up date** (created before about 2020): this would remove **ann** and **cy**. Ann is a paying pro user who logged in two weeks ago, so this reading is almost certainly wrong.
- **Inactive** (no login in over a year): this would remove **bob** and **cy**. Both are on the free plan.

**My recommendation:** treat "old" as inactive, using a cutoff of no login in the last 12 months. That removes bob and cy. I'd do it on a new branch and leave the deploy to you.

Should I go ahead with that, or do you want a different cutoff or different users?