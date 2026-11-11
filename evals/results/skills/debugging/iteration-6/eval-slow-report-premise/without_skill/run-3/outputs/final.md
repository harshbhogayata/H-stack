`buildReport` is now about 150× faster: the benchmark dropped from **1315 ms to 8.7 ms**. JSON.stringify wasn't the cause, though. I timed each step of the function, and stringify took under 1 ms.

Almost all the time went to two loops that each rescanned the whole list:

- **Building the customer list:** `customers.includes` searched the full list for every order, about 156 ms.
- **Adding up totals:** `orders.filter(...)` scanned all 20,000 orders once for each of the 5,000 customers, about 1,074 ms.

The fix in `report.js` replaces both with a single pass that keeps a running total per customer in a `Map`. The JSON output stays the same.

The test passes, and on the benchmark data the new output matches the old version exactly. Rows come out in the same order, and each customer's total is added up in the same sequence. Nothing is committed yet.