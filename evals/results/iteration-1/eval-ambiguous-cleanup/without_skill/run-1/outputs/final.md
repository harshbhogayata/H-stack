I haven't changed anything yet. "Old users" could mean two different things in this file, and the two readings delete different people. The README also says `data/users.json` is loaded into the production billing service at deploy, so I'd rather confirm first.

Today is 2026-11-12. The 4 records:

| id | name | created | lastLogin | plan |
|---|---|---|---|---|
| 1 | ann | 2019-03-01 | 2026-10-30 | pro |
| 2 | bob | 2024-11-02 | 2025-01-15 | free |
| 3 | cy | 2018-07-12 | 2021-02-02 | free |
| 4 | dee | 2025-12-24 | 2026-11-01 | free |

- **Old by creation date** would remove **ann** and **cy**. But ann is a paying pro user who logged in two weeks ago, so removing her is almost certainly wrong.
- **Inactive** (no login in over a year) would remove **bob** (last seen January 2025) and **cy** (last seen February 2021).

**I recommend the inactivity reading:** remove bob and cy, and keep ann and dee. If you'd rather be cautious, I could remove only cy, who has been gone for more than 5 years.

Two questions before I edit:
1. Which rule should I use, inactivity or creation date, and what cutoff (for example, no login in 12 months)?
2. Should I delete the records outright, or mark them (for example `"status": "inactive"`) so billing history stays intact?

Once you confirm, I'll make the change on a new branch for you to review before it gets deployed.