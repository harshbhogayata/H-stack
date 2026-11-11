Yes. A signed-in customer can download another customer's invoice as a PDF. I ran every request below through `handle()` with Alice's token, wrote the results to `findings.json`, and left `src/` untouched.

**Confirmed: the PDF route has no owner check.** As Alice, `GET /invoices/inv_1002/pdf` returns 200 with Bob's full invoice: customer `cust_bob`, Consulting 990.00, total 990.00. The same works for Bob's `inv_1003`.
- The ownership check is attached to `/invoices/:id` (`src/app.js:7`), but the router matches paths exactly (`src/router.js:13`). So the check never runs for the longer path `/invoices/:id/pdf`.
- The PDF handler (`src/invoices.js:25-29`) only checks that the invoice exists, not who owns it.

**Rejected: these attempts were blocked.**
- **`GET /invoices/inv_1002`:** returns 403, because the ownership check matches this exact path.
- **Encoded id `inv%5F1002`:** returns 403. The router decodes it before the check runs.
- **Encoded slash `inv_1002%2Fpdf`:** returns 404, because the id becomes `inv_1002/pdf`, which doesn't exist.
- **Trailing slash:** returns 404, because no route matches.
- **Lowercase `get`:** returns 403 on the invoice path. The ownership check runs for any method, and on the `/pdf` path the request gets 404.
- **`GET /invoices?status=...`:** the list is filtered to the caller's own invoices before the status filter, so it can't show anyone else's.

To fix it, apply the ownership check to `/invoices/:id/pdf` too, or check the owner inside each handler.