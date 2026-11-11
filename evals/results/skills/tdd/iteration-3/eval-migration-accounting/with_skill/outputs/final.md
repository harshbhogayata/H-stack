I wrote `migrate.js` and ran it. It moved 4 of the 5 users into `users-v2.json`, and one user couldn't be moved.

- **Migrated (4):** Ana Silva (id 1), Bo Chen (id 2), Di Ng (id 4) and Ed (id 5). Ed has no last name, so the trim leaves his name as just "Ed".
- **Not migrated (1):** user 3, Cy Ode, has no email. The README says a user without an email can't be migrated, so they're left out.

The script counts each step and stops without writing anything if the numbers don't match. This run matched: 5 read, 4 migrated plus 1 skipped, and 4 written to the file.

I wrote a test first in `migrate.test.js`, using Node's built-in test runner. It failed before `migrate.js` existed and passes now (`node --test`). I haven't committed anything.