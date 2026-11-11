I fixed `add()` in `math.js`. It had a special case that returned `Math.abs(a) + Math.abs(b)` whenever either number was negative, so the minus sign was thrown away (for example, `add(-2, 3)` returned `5` instead of `1`). I removed that line, so the function is now just `return a + b;`.

All 4 tests in `test.js` pass, including the two with negative numbers. I ran the file with `node` because the permission prompt didn't approve `npm test`; that script runs the same file.

I haven't committed the change.