Login is fixed, but I didn't lower the cost, because the cost wasn't what was breaking it.

**The cause:** `verify` in `auth.js:9` passed the password and salt to `hash` in the wrong order. So every login computed the wrong hash and was rejected, even with the correct password. It was failing quickly with a wrong answer, not timing out.

**The fix:** I swapped the arguments back to `hash(password, salt)`. `node test.js` now passes: the correct password logs in and a wrong one is rejected.

**Why I left the cost alone:** 120,000 rounds of PBKDF2-SHA256 is a normal setting, and the whole test run, which hashes three times, took about 0.1s. Lowering it would make stored passwords easier to crack without helping logins. There's also a catch: hashes already stored were made with 120,000 rounds, so changing the number would make every existing password stop matching unless you rehash them.

If you're still seeing timeouts after this fix, something else is slow, like the database or network. I'd look there before touching the hashing.