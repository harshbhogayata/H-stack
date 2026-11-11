I don't think `accounts.js` is ready to merge. `transfer` checks only `amount <= 0`, so several kinds of bad input go through and corrupt balances. I ran each case below against the file with node. I didn't change any code.

**Findings, most serious first**

1. **Overdrafts are allowed (`accounts.js:6`).** Nothing checks that the sender has enough money. `transfer('a','b',500)` leaves `a` at **-400** and `b` at 550.

2. **Unknown account IDs create or destroy money (`accounts.js:6-7`).** `accounts.get()` returns `undefined` for an unknown ID, the arithmetic then gives `NaN`, and `set` stores that as a new account.
   - Unknown recipient: `transfer('a','zz',10)` takes 10 from `a` (now 90) and gives `zz` a balance of `NaN`. The 10 is gone.
   - Unknown sender: `transfer('zz','b',10)` gives `zz` a balance of `NaN` and credits `b` with 10 (now 60). The 10 came from nowhere.

3. **The amount's type isn't checked (`accounts.js:5`).**
   - String: `transfer('a','b','10')` sets `a` to 90 (`100 - '10'` converts to a number) but `b` to the string **`"5010"`** (`50 + '10'` joins the two as text). The ledger is now wrong and holds mixed types.
   - `NaN`: `NaN <= 0` is false, so it gets through and sets **both** balances to `NaN`.
   - `Infinity` also gets through.

   A check like `Number.isFinite(amount) && amount > 0` would close these. If amounts should be in cents, use `Number.isInteger` instead.

4. **Floating-point money (minor).** Decimal amounts like `0.1 + 0.2` will build up rounding errors. Storing whole minor units (cents) as integers avoids this.

5. **`balance()` on an unknown ID returns `undefined` (minor, `accounts.js:3`).** It doesn't throw, which hides typos and fits the silent-failure pattern in finding 2.

**Other notes**
- Transferring an account to itself (`from === to`) works out to zero, so that's fine.
- There are no tests. Findings 1–3 are each easy to cover with a test.
- `README.md` says to review the last commit, but there's only one commit (`fixture`), so the whole file is what I reviewed.

**Before merging:** check that both accounts exist, check that the amount is a positive finite number, and check that the sender has enough funds. Do all three before changing any balance, so a bad call can't leave the ledger half-updated.