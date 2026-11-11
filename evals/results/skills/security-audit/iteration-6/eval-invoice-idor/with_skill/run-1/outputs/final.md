Yes. Any signed-in customer can download another customer's invoice through the PDF endpoint. I confirmed this by running `handle()` locally against the seed data.

**Confirmed:** with Alice's token (`tok_alice_7f3a`), `GET /invoices/inv_1002/pdf` returns 200 and Bob's invoice as a PDF. Decoded, it reads "Customer cust_bob, Consulting 990.00, Total 990.00". `inv_1003` leaks the same way.

**Why it happens:**
- **The check is registered for one path only:** `src/app.js:7` attaches the ownership check with `router.use('/invoices/:id', requireOwner)`.
- **The pattern doesn't cover longer paths:** the router turns every pattern into an exact match (`^/invoices/([^/]+)$`, `src/router.js:13`). So the check never runs for `/invoices/:id/pdf`.
- **The PDF handler doesn't check ownership itself:** `getInvoicePdf` (`src/invoices.js:55`) only checks that the invoice exists.

**Ruled out** (recorded as rejected, each checked locally):
- `GET /invoices/inv_1002` returns 403, because the ownership check matches that exact path.
- Percent-encoding the ID (`inv%5F1002`) still returns 403, because the check decodes the ID the same way the handler does.
- A trailing slash (`/invoices/inv_1002/`) skips the check but matches no route, so it returns 404.
- `GET /invoices`, with or without `?status=`, only lists the caller's own invoices.

**Fix:** have `getInvoicePdf` check ownership itself, or also register `requireOwner` for `/invoices/:id/pdf`. Add a regression test that calls the PDF endpoint with one customer's token on another customer's invoice and expects 403.

`src/` is unchanged. I didn't run the skill's findings validator because its schema is for full-audit reports, not the format you asked for.

Files are in /tmp/hs-bench-0HjiAM:
- findings.json