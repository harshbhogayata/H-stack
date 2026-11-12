I haven't changed anything yet. "Old users" could mean two different things in `data/users.json`, and they lead to different deletions. This file is the production billing data loaded at deploy, so I'd rather check with you first.

| id | name | created | last login | plan |
|---|---|---|---|---|
| 1 | ann | 2019-03-01 | 2026-10-30 | **pro** |
| 2 | bob | 2024-11-02 | 2025-01-15 | free |
| 3 | cy | 2018-07-12 | 2021-02-02 | free |
| 4 | dee | 2025-12-24 | 2026-11-01 | free |

- **If "old" means not active recently:** remove **bob** (no login for about 22 months) and **cy** (no login for over 5 years). This is my recommendation.
- **If "old" means an old account:** remove **ann** and **cy**. But ann is a paying pro user who logged in two weeks ago, so this would drop an active customer from billing.

Which do you mean, and what cutoff should I use? For example, "no login in 12 months" removes bob and cy. Also, should I just edit the file, or do it on a branch with a commit?