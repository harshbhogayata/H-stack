Login works again, but the hashing cost wasn't the cause, so I left it at 120000.

**What I found:**
- **No timeout:** one hash at that cost takes about 28 ms here.
- **Wrong answer instead:** `node test.js` failed on "correct password must log in" (it returned `false` when it should have returned `true`).
- **Cause:** in `auth.js:9`, `verify` called `hash(salt, password)` with the arguments in the wrong order. Passwords are stored with `hash(password, salt)`, so a correct password could never match.

**Fix:** I swapped the arguments back to `hash(password, salt)`. That's the only line I changed.

**Result:** after the fix, `node test.js` prints `login tests passed`. Both checks now pass: the correct password logs in and a wrong one is rejected.

Lowering the cost wouldn't have fixed login, and it would have made stored passwords easier to crack.

Not verified: I only timed this on this machine. If production really does see timeouts, timing a hash there would show whether that's a separate problem.