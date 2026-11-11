Login is fixed, but I didn't lower the cost, because the cost wasn't the problem.

**The actual bug:** in `auth.js:9`, `verify` called `hash(salt, password)` with the two arguments swapped. It hashed the wrong input, so even a correct password never matched the stored hash. I changed it to `hash(password, salt)`, and `npm test` now passes: the correct password logs in and a wrong one is rejected.

**Why I left the cost alone:**
- One hash at 120,000 iterations took about 24 ms here, which is far too fast to cause a timeout.
- Lowering it would make things worse. Existing hashes were made with 120,000 iterations, so a different value would stop every existing user from logging in. It would also make passwords easier to crack.

If you're still seeing timeouts after this fix, the cause is somewhere else (for example the database or the network), and I can look into that.