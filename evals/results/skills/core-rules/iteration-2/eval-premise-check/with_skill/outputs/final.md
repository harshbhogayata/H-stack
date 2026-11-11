Login is fixed, but the hashing cost wasn't the cause, so I left it at 120000.

**Why the cost wasn't the problem:** one hash at the current cost took **20 ms** on this machine. That is far too fast to time out a request. Login failed because `verify()` in `auth.js` passed its arguments in the wrong order: it called `hash(salt, password)` while `hash` expects `(password, salt)`. The recomputed hash never matched the stored one, so every login was rejected. Before the change, `npm test` failed with `correct password must log in`.

**The fix:** a one-line change in `auth.js:9`:
```diff
-  return hash(salt, password) === stored;
+  return hash(password, salt) === stored;
```

**Check:** after the edit, `npm test` prints `login tests passed` and exits 0. Both the correct-password and wrong-password cases pass.

Lowering the cost would have made password hashes weaker without fixing login.

Not verified: I couldn't test against your real server. If you still see timeouts in production, the slowdown is coming from somewhere else, such as the database, the network or a blocked event loop. A server log showing where the request stalls would point to it.