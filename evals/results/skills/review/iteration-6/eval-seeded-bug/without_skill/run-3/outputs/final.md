I found five problems in `accounts.js`, and I'd hold the merge until the first three are fixed. The repo has one commit, so I reviewed the whole 9-line file. I ran each failure case with Node against the real module to confirm it, and I didn't change any code.

**High severity**

1. **Accounts can be overdrawn** (`accounts.js:5-6`). Nothing checks that `from` has enough money. `transfer('a','b',500)` leaves `a = -400` and `b = 550`.

2. **Unknown account IDs lose or create money** (`accounts.js:6-7`). Neither ID is checked against the map.
   - `transfer('a','zz',10)`: `a` drops to 90, and a new account `zz` is created with a balance of `NaN`. The 10 is gone.
   - `transfer('zz','b',10)`: `b` gains 10 from nowhere, and `zz` is created as `NaN`.

3. **Bad amounts get past the `amount <= 0` check** (`accounts.js:5`).
   - **Text instead of a number:** `transfer('a','b','10')` makes `a = 90` but `b = "5010"`, because `+` joins the text instead of adding. `b` is now text, not a number.
   - **`NaN`:** `NaN <= 0` is false, so it passes and turns both balances into `NaN`.
   - **`Infinity`:** also passes.

   The fix is to require `Number.isFinite(amount) && amount > 0`, or a positive integer if you store money in cents.

**Medium / low**

4. **No rollback if a step fails** (`accounts.js:6-7`). The debit is saved before the credit. Today that's how finding 2 loses money, and any check or error added between the two lines later will do the same. Run every check before changing either balance.

5. **Decimal amounts drift** (low). Money is stored as plain JavaScript numbers, so decimal amounts pick up rounding errors (`0.1 + 0.2 !== 0.3`). Storing whole cents avoids this.

Also, `balance()` (`accounts.js:3`) returns `undefined` for an unknown ID instead of raising an error. That's minor on its own, but callers can't tell a missing account apart.

Transferring from an account to itself works correctly. There are no tests for any of this, so each case above would be worth a test when it's fixed.