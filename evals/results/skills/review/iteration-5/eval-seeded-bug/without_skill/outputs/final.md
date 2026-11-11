I reviewed `accounts.js`, which is the only commit (`89bee3f`). I ran each edge case below in node to confirm it, and I didn't change any code. **I don't think this is ready to merge.** The first three findings let a single bad call quietly corrupt balances.

**1. Overdrafts are allowed (`accounts.js:6`).** Nothing checks that `from` has enough money. `transfer('a','b',1000)` left `a` at `-915`. Before moving money, it should reject the transfer if `balance(from) < amount`.

**2. Unknown account IDs corrupt state (`accounts.js:6-7`).**
- **Unknown `to`:** `accounts.get(to)` returns `undefined`, so `undefined + 5` becomes `NaN`. `transfer('a','zzz',5)` took 5 from `a` and created account `zzz` holding `NaN`. The money is gone.
- **Unknown `from`:** the same thing happens in reverse. The source becomes `NaN` and the destination gains money from nowhere.

Both accounts should be checked with `accounts.has()` before anything is written.

**3. The amount isn't checked to be a number (`accounts.js:5`).** `amount <= 0` only rejects numbers that are zero or negative. Other values get through:
- **A string like `'10'`** passes the check. `100 - '10'` gives `90`, but `50 + '10'` gives the string `'5010'`. After that, every deposit into `b` is glued onto the text instead of added.
- **`NaN`** passes the check (`NaN <= 0` is false) and turns both balances into `NaN`.
- **`Infinity`** is accepted.

Use something like `Number.isFinite(amount) && amount > 0`, or `Number.isInteger` if amounts are in cents.

**4. Floating-point money.** Decimal amounts will pick up rounding errors (for example, `0.1 + 0.2 !== 0.3`). Storing whole cents as integers avoids this.

**5. Minor issues:**
- `transfer(x, x, n)` does nothing but doesn't fail. It's harmless, but it's probably better to reject it.
- The two `set` calls aren't atomic. That's fine for synchronous in-memory code, but it would matter if this moved to async or a real database.
- `balance()` returns `undefined` for unknown IDs instead of throwing.
- Balances live in shared module state with no way to reset them, which makes the module hard to test.
- There are no tests.