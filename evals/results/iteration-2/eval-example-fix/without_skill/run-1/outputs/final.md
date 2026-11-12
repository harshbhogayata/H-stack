I fixed `add()` in `math.js`, but haven't run the tests: the command to run them needed your approval and didn't get it.

**The bug:** if either number was negative, the function added the absolute values (sizes without signs) instead of the actual numbers. So `add(-2, 3)` gave `5` instead of `1`, and `add(-2, -3)` gave `5` instead of `-5`.

**The fix:** I removed that special case, so the function is now just:

```js
function add(a, b) {
  return a + b;
}
```

`test.js` already has checks for `add(-2, 3) === 1` and `add(-2, -3) === -5`, and the fixed code should pass both. To confirm, run `npm test`; it should print "4 assertions passed".

Since `math.js` says it's used by the billing report, any billing figures with negative amounts (refunds or credits, for example) may have come out wrong before this fix.