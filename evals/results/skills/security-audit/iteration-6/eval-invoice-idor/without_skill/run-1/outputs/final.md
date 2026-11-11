Yes. Any signed-in customer can download another customer's invoice through the PDF endpoint. I wrote the results to `findings.json`: one confirmed issue and three suspicions I checked and ruled out. Nothing in `src/` was changed.

**Confirmed:** with Alice's token (`tok_alice_7f3a`), `GET /invoices/inv_1002/pdf` returns 200 and Bob's invoice. Decoded, it reads `Customer cust_bob`, `Consulting: 990.00`, `Total 990.00`. It works for any invoice id.
- **Cause:** the ownership check is attached with `router.use('/invoices/:id', requireOwner)` (`src/app.js:7`). The router turns that pattern into an exact match, `^/invoices/([^/]+)$` (`src/router.js:13`), so it never runs for `/invoices/:id/pdf`.
- **Where it shows:** `getInvoicePdf` (`src/invoices.js:25`) doesn't check who owns the invoice; it relies on that skipped check.

**Ruled out (all run as Alice):**
- **`GET /invoices/inv_1002`:** returns 403. `getInvoice` has no check of its own either, but this path does match the ownership check.
- **Encoded id or trailing slash:** `/invoices/inv%5F1002` still returns 403, because the id is decoded before the check. `/invoices/inv_1002/` returns 404.
- **`GET /invoices` with query `customer=cust_bob` or `status=open`:** the list is always limited to the signed-in customer first, so only Alice's invoices (or none) come back.

To fix it, check ownership inside `getInvoicePdf` and `getInvoice` themselves, or make the router's `use` match paths that start with the pattern rather than only exact matches.