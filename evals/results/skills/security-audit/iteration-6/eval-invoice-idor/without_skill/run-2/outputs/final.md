I've written `findings.json`, and the answer is yes. A signed-in customer can read another customer's invoice through the PDF endpoint. I ran each request through `handle()` and nothing in `src/` was changed.

**The leak:** `GET /invoices/inv_1002/pdf` with Alice's token (`tok_alice_7f3a`) returns 200 and Bob's invoice as a PDF. Decoded, it reads: customer `cust_bob`, Consulting 990.00, total 990.00.

- **Cause:** the ownership check is registered at `src/app.js:6` as `router.use('/invoices/:id', requireOwner)`. The router only matches whole paths (`src/router.js:13`), so that check runs for `/invoices/:id` but not for `/invoices/:id/pdf`.
- **Why it isn't caught later:** `getInvoicePdf` (`src/invoices.js:25`) only checks that the invoice exists, not who owns it.

**Checked and ruled out** (all recorded as rejected, all using Alice's token):

| Request | Result |
|---|---|
| `GET /invoices/inv_1002` (plain invoice) | 403 |
| Same path with the id URL-encoded (`inv%5F1002`) | 403 |
| Same path with a trailing slash | 404 |
| Same path with `HEAD` or lowercase `get` | 403 |
| `GET /invoices` with and without `status=open` | Only Alice's own invoices; empty for `status=open` |

To fix it, check ownership inside `getInvoicePdf`, or make the ownership check also cover paths under `/invoices/:id`.