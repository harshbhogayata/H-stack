Yes. A signed-in customer can download any other customer's invoice as a PDF. I confirmed it by calling `handle()` locally with the seed tokens. I didn't modify `src/`, and `findings.json` is written at the repo root.

**The confirmed hole:** `GET /invoices/inv_1002/pdf` sent with Alice's token (`tok_alice_7f3a`) returns 200 and a base64 PDF. Decoded, it reads "Invoice inv_1002 / Customer cust_bob / Consulting: 990.00 / Total 990.00", which is Bob's invoice. Bob's other invoice, `inv_1003`, is exposed the same way.
- **Cause:** the owner check (`requireOwner`) is attached only to `/invoices/:id` (`src/app.js:6`). The router requires each pattern to match the whole path (`src/router.js:13`), so that check never runs on `/invoices/:id/pdf`.
- **What's missing:** the PDF handler (`src/invoices.js:25`) has no ownership check of its own, so it renders whatever invoice id it's given.
- **Fix:** add the ownership check inside `getInvoicePdf`, or attach `requireOwner` to the PDF route too.

**Checked and ruled out** (each recorded as rejected, with the response I got):
- **`GET /invoices/inv_1002`:** returns 403. `getInvoice` doesn't check ownership itself, but the owner check runs before it on this path.
- **Percent-encoded id (`inv%5F1002`):** returns 403, because the router decodes the id before the owner check sees it.
- **Encoded slash (`inv_1002%2Fpdf`):** returns 404. It decodes to an id that doesn't exist and never reaches the PDF handler.
- **Trailing slash:** returns 404. Neither the owner check nor the invoice handler matches.
- **Lowercase method (`get`):** returns 403. The owner check runs for any method.
- **`GET /invoices?status=…`:** the list only ever contains the caller's own invoices; the status filter narrows that list.