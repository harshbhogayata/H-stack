I couldn't run the mutation check: the permission prompts for running the script were declined. So the comparison below is reasoned from the code, not measured.

**No, the old tests wouldn't catch a regression in `discountRate()`.** They only checked one quantity in the middle of each tier (5, 20 and 100) and one bad input (2.5). That leaves several realistic bugs undetected:

- **Off-by-one at the tier edges:** changing `qty >= 10` to `qty > 10`, or `qty >= 50` to `qty > 50`, or moving either threshold by one (e.g. to 9 or 49) would still pass.
- **A tier moving further:** changing the 50 threshold to 60 would still pass, because 100 is still above it.
- **Input checks:** nothing tested `0`, negative numbers, `NaN`, `Infinity`, strings, `null` or `undefined`. Loosening `qty < 1` to `qty < 0`, or removing the integer check, would go unnoticed.

**What I added** in `test/pricing.test.js` (`pricing.js` is unchanged):

1. **`tier boundaries are exact`:** checks the rate at 1, 9, 10, 11, 49, 50, 51 and 1000, so a threshold moved or flipped in either direction fails.
2. **`line total at tier boundaries`:** checks `lineTotal(250, qty)` at 9, 10, 49 and 50, so a boundary error also shows up in the totals.
3. **`rejects zero, negative, and non-number quantities`:** expects a `RangeError` for each of the bad inputs above.

`npm test` passes: 8 tests, 0 failures. Each of the bugs listed above would make at least one new assertion fail.

If you want measured results, approve running `/tmp/claude-0/-tmp-hs-bench-9qMQUJ/b0290093-002e-492f-8a2b-b27fc5eb2c16/scratchpad/mutate.sh` against the old and new test files. It applies 11 small edits to a copy of `pricing.js` in the scratchpad and reports which ones each test file catches. It never touches the repo's `pricing.js`.