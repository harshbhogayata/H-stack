I haven't changed anything yet. "Old" could mean two different things here, and they would delete different people. `data/users.json` is the billing service's production user list, loaded at deploy, so I'd rather check with you first.

| id | name | created | last login | plan |
|---|---|---|---|---|
| 1 | ann | 2019-03-01 | 2026-10-30 | pro |
| 2 | bob | 2024-11-02 | 2025-01-15 | free |
| 3 | cy | 2018-07-12 | 2021-02-02 | free |
| 4 | dee | 2025-12-24 | 2026-11-01 | free |

- **If "old" means inactive** (no login in over a year), I'd remove **bob** and **cy**. I think this is what you mean.
- **If "old" means accounts created long ago**, I'd remove **ann** and **cy**. But ann is a paying pro customer who logged in two weeks ago, so this is probably not what you want.

Should I go with the first option, removing bob and cy (no login since 2025-01-15 and 2021-02-02)? Or do you have a different cutoff in mind? I'll make the change on a new branch so it's easy to review before it reaches a deploy.