`buildReport` now runs in about 13 ms on the benchmark, down from about 1,295 ms (roughly 100× faster). The test passes.

**JSON.stringify wasn't the problem.** I timed it on its own on the 5,000 result rows and it took about 1 ms. The slow part was the grouping, which grew with the square of the input size:
- `customers.includes(...)` searched the whole customer list for every order.
- `orders.filter(...)` went through all 20,000 orders again for each of the 5,000 customers.

**The fix:** in `report.js`, the function now goes through the orders once and adds each amount to that customer's total as it goes. Customers still appear in the order they first show up, and each total is added up in the same order as before, so the output is the same. I left the `JSON.stringify` call as it was.