I don't think `accounts.js` is ready to merge. `transfer()` (`accounts.js:4-8`) checks only that `amount <= 0` is false, and that lets several bad inputs corrupt balances. I ran each case below in node; the results are pasted from the run. I didn't change any code.

### Blocking

1. **Overdrafts are allowed** (`accounts.js:6`). Nothing checks the sender's balance. `transfer('a','b',500)` leaves `a` at `-400`.

2. **A string amount corrupts the receiver's balance** (`accounts.js:5,7`). `'10' <= 0` is false, so the check passes. The subtraction then converts the string to a number, but `+` joins strings. `transfer('a','b','10')` leaves `a = 90` and `b = "5010"`, which is now a string.

3. **`NaN` gets through the check** (`accounts.js:5`). `NaN <= 0` is false, so `transfer('a','b',NaN)` sets both balances to `NaN`. `Infinity` also passes.

4. **Unknown account IDs lose or create money** (`accounts.js:6-7`).
   - Unknown receiver: `transfer('a','zz',10)` takes 10 from `a`, then creates `zz` with a balance of `NaN`. The 10 is gone.
   - Unknown sender: `transfer('zz','b',10)` adds 10 to `b` from nowhere and creates `zz` with a balance of `NaN`.

   Calling `balance()` with an unknown ID also returns `undefined` without any error.

5. **The transfer isn't all-or-nothing.** The sender is debited before anything about the receiver is checked, so when the second step goes wrong (case 4) the first has already happened. Doing every check before either `set` would fix this.

### Minor

6. **Decimal money values.** Fractional amounts are plain floating-point numbers, which can pick up rounding errors over many transfers. Storing whole cents (integers) avoids this. My `0.1 + 0.2` test happened to come out right, so this is a risk rather than an observed bug.
7. **Sending to yourself** (`from === to`) works and does nothing, but you may want to reject it explicitly.
8. **No tests** exist in the repo for any of these cases.

### Suggested fix
At the start of `transfer`:
- require `Number.isFinite(amount) && amount > 0`, and ideally `Number.isInteger` if you switch to cents;
- require both accounts to exist (`accounts.has(from)` and `accounts.has(to)`);
- require `accounts.get(from) >= amount`.

Only after all of these pass should it change either balance.