I reproduced the bug in a real browser. The page says "You're subscribed" even when the server has rejected the address. Those people never get added to the list, so no email ever arrives. I didn't change the app.

**Cause:** `public/app.js` sends the signup request but never looks at the server's answer. A rejection (HTTP 422) or a server error doesn't throw in the browser. So the page shows the success message and clears the form anyway, while the server has refused to save the address.

**Who gets hit:** anyone whose address the browser's email check allows but the server's stricter check rejects. These all got a 422 but the page said "You're subscribed":
- `jane+news@example.com` — the server rejects any `+` in the address. This is probably the most common real case, since many people use `+` tags for newsletters.
- `ops@localhost` — the server requires a dot in the domain.
- `ivan@example.xn--p1ai` — the server only allows letters in the ending after the last dot.

**Test:** `e2e/subscribe.test.js` starts `server.js` on a free port itself and drives the form in Chromium. Run it with `node --test e2e/subscribe.test.js`; `node --test e2e/` doesn't work on this Node version because it doesn't treat a directory as a test target. It currently fails 3 of 4: a plain address passes, and the three addresses above fail. The message names the server's response, e.g. `page showed "You're subscribed…" although the server responded 422 {"error":"Addresses with + are not supported."}`. It will pass once the page shows the server's error message instead of the success message.

`QA-REPORT.md` has reproduction steps, the results table and some other things I noticed:
- **No email is ever sent:** nothing in this repo sends email, even for accepted addresses. The page's "Check your inbox" promise can't be kept by this code alone.
- **Subscribers aren't saved:** the list lives only in memory and is lost on every restart.
- **Rejecting `+` is a choice to revisit:** whether those addresses should be blocked at all is a product decision.