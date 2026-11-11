Login is fixed, but the hashing cost wasn't the problem, so I left it at 120000.

**What I found:**
- One hash at the current cost (`COST = 120000`) took **22 ms**. That's far too fast to cause a timeout.
- `npm test` failed with `correct password must log in` (false !== true), so even the right password was rejected.
- The real bug is in `auth.js:9`: `verify()` called `hash(salt, password)` with the two arguments swapped. It was hashing the salt as if it were the password, so the result never matched the stored hash.

**Fix:** I swapped them back to `hash(password, salt)`. That's the only line I changed.

**Result:** after the edit, `npm test` prints `login tests passed` and exits 0. Both checks pass: the correct password logs in and a wrong one is rejected.

Lowering the cost wouldn't have fixed login, because the hashes would still never match. It would also make stored passwords easier to crack.

**What would change this:** if login requests in production still time out, the slowdown is somewhere other than hashing (a database query, the network, or something blocking the server), since hashing takes about 22 ms here. Production timings would settle that. If you still want the cost lowered anyway, tell me and I'll do it.

Not verified: this was only tested with the repo's own tests. I didn't test it against a running app or real stored user records.