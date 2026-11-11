Yes. Any signed-in customer can read another customer's invoice through the PDF endpoint. I ran each request in `findings.json` against `handle()` with Alice's token, and `src/` is unchanged.

**The leak:** `GET /invoices/inv_1002/pdf` with Alice's token (`tok_alice_7f3a`) returns 200 with Bob's invoice. The content decodes to "Invoice inv_1002 / Customer cust_bob / Consulting: 990.00 / Total 990.00". Bob's other invoice, `inv_1003`, leaks the same way.

**Why it happens:**
- The ownership check is attached at `src/app.js:7` with `router.use('/invoices/:id', requireOwner)`.
- The router matches each route pattern against the whole path (`src/router.js:13`). So the check runs for `/invoices/<id>` exactly and never for `/invoices/<id>/pdf`.
- The PDF handler, `getInvoicePdf` (`src/invoices.js:25-29`), only checks that the invoice exists, not who owns it.

**Checked and ruled out (recorded as rejected):**
- **`GET /invoices/inv_1002`:** returns 403. The ownership check runs first.
- **Percent-encoded id (`inv%5F1002`):** returns 403. The check and the handler decode the id the same way.
- **Trailing slash or encoded slash:** both return 404.
- **`/invoices?status=open`:** returns only Alice's own invoices, because the list is filtered to her account before the status filter applies.
- **POST:** returns 403. The check applies to every method, and there are no non-GET handlers anyway.

To fix it, put an ownership check inside `getInvoicePdf`, or attach `requireOwner` to the `/pdf` route too.