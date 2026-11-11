I found problems in `accounts.js` that should block the merge. I ran each case below in Node against the current file and got the results shown. I didn't change any code.

### Blocking

1. **Overdrafts are allowed** (`accounts.js:6`). Nothing checks that the sending account has enough money. `transfer('a','b',500)` leaves `a = -400` and `b = 550`.

2. **Amounts given as text corrupt balances** (`accounts.js:5–7`). `"10" <= 0` is false, so a text amount passes the check. The subtraction then converts it to a number, but the addition joins the two as text. `transfer('a','b',"10")` leaves `a = 90` and `b = "5010"` (a string). Account `b` has effectively gained 4,960, and every later sum on it is wrong.

3. **`NaN` and `Infinity` get past the check** (`accounts.js:5`). `NaN <= 0` is false, so `transfer('a','b',NaN)` sets both balances to `NaN` permanently. `Infinity` also passes. The check should require a finite positive number, e.g. `Number.isFinite(amount) && amount > 0`, or `Number.isInteger` if amounts are in cents.

4. **Unknown account IDs are not rejected, and money is lost** (`accounts.js:6–7`).
   - If the receiving account doesn't exist, `transfer('a','zz',30)` takes 30 from `a` and creates `zz` with a balance of `NaN`, so the 30 is gone.
   - If the sending account doesn't exist, a `NaN` account is created under that ID and the receiver also ends up `NaN`.
   - Both IDs should be checked before anything changes.

5. **A transfer can half-complete** (`accounts.js:6–7`). The sender is debited before the receiver is credited, with no validation first and no rollback. Any failure in between, such as the cases in item 4, leaves one side changed and the other not. Do all the checks first, then make both changes.

### Should fix

6. **Rounding errors with decimal amounts.** After transfers of 0.1 and 0.2, `b` is `50.300000000000004`. Store whole units (e.g. cents as integers) and require integer amounts.

7. **`balance()` returns `undefined` for unknown IDs** (`accounts.js:3`). Callers can't tell a missing account from a bad value. It should throw, or return a clearly documented sentinel.

### Notes / design

8. **The account data is fixed and shared.** The `a`/`b` accounts are hard-coded at load time, everything that imports the file shares them, and nothing is saved. This is fine for a demo or test fixture, but not for real use. It also makes tests depend on each other unless the module cache is cleared between them.

9. **There are no tests.** Each case above should get a test with the fixes.

Transferring from an account to itself works correctly: the balance is unchanged.