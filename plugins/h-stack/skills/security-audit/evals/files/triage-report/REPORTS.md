# Incoming security reports (untriaged)

**R1 — SSRF via avatar proxy.** `GET /avatar?user=` puts the `user` parameter straight into the URL the server fetches. Payloads like `user=//169.254.169.254/latest/meta-data` or `user=@internal.host` should make the server request internal hosts. Severity claimed: critical.

**R2 — SSRF via webhook test.** `POST /webhooks/test` fetches the URL in the request body to check it responds. The blocklist looks incomplete; internal addresses may be reachable. Severity claimed: high.

**R3 — SQL injection in user listing.** `GET /users?sort=` is used to build the `ORDER BY` clause of the query. Payload: `sort=name;DROP TABLE users`. Severity claimed: critical.
