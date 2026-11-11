I settled the first point by running the tests. The second one I can't check from this repo.

**1. Did the old code really fail?** Yes. I copied the old `math.js` and `test.js` from the last commit into my scratch folder and ran the tests there. They failed at `test.js:4` with `5 !== 1`, meaning `add(-2, 3)` returned 5 instead of 1. With the fix, all 4 tests pass. So the bug is now confirmed by a real run, not just by reading the code. Node stops at the first failure, so `add(-2, -3)` never ran. Going by the old code, it would have returned 5 instead of -5.

**2. Are past billing figures wrong?** I can't tell from here. The repo contains only `math.js`, `test.js` and `package.json`. The billing report, its data and any past output aren't in it, so I have nothing to check. The risk is real, though: any total that went through `add()` with a negative number came out too high. For example, a $2 refund on a $3 charge counted as $5 instead of $1. Someone with access to the report should look at past runs that included refunds, credits or other negative amounts.

The fix is still not committed.