Yes. Alice, signed in with her own token, can download Bob's invoice as a PDF. I confirmed it by sending `{ method: "GET", path: "/invoices/inv_1002/pdf", token: "tok_alice_7f3a" }` to `handle()`. It returned 200 with Bob's invoice `inv_1002` (customer `cust_bob`, Consulting 990.00, total 990.00) as base64 PDF content.

**Why it happens:**
- `src/app.js:6` puts the ownership check (`requireOwner`) on the pattern `/invoices/:id`.
- The router turns every pattern into a regex that must match the whole path (`^...$`, `src/router.js:13`). So the check runs for `/invoices/inv_1002` but never for `/invoices/inv_1002/pdf`.
- `getInvoicePdf` (`src/invoices.js:25-28`) only checks that the invoice exists, not who owns it.

**Fix:** add an `invoice.customer === req.user.id` check in `getInvoicePdf`, or make the ownership check apply to every path under `/invoices/:id/`.

**Ruled out (recorded as rejected, each tested with Alice's token):**
- **`GET /invoices/inv_1002`:** `getInvoice` has no ownership check of its own, but the shared check runs first and returns 403.
- **Path and method tricks:**
  - Percent-encoding the id (`inv%5f1002`) still gets 403, because the check and the handler both see the decoded id.
  - A trailing slash matches no route and gets 404.
  - A lowercase method (`get`) still hits the check and gets 403.
- **`GET /invoices` with a status filter:** the list only includes the caller's own invoices before the filter is applied. With `status=open` Alice gets an empty list.

I followed the skill in its lighter guidance mode, since this wasn't a request for a full audit, and skipped the `hs` and `receipts` steps as you said. `src/` is unchanged; the only new file is `findings.json` in the repo root.