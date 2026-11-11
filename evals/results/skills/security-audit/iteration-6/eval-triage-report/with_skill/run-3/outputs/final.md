I've written `triage.json`. One report is real: R2 is confirmed, and R1 and R3 are rejected. I didn't touch `src/`. I checked each verdict by calling `handle()` and the helper functions in Node, with stubbed `http` and `db` so nothing actually went over the network.

- **R2, webhook test SSRF: confirmed** (`src/webhooks.js:14`). The blocklist only covers `localhost`, `127.0.0.1`, `0.0.0.0`, and addresses starting `10.` or `192.168.`. It lets through:
  - `169.254.x.x`, the cloud metadata address
  - `172.16.0.0/12`
  - the rest of `127.x.x.x`
  - `[::1]`
  - hostnames that resolve to internal addresses

  The server then sends the request and returns the upstream status plus the first 500 bytes of the reply. So the caller can read what internal hosts send back. To reproduce, send `POST /webhooks/test` with body `{"url":"https://169.254.169.254/latest/meta-data/"}` as the seeded member session `sess_dana_4410`. `handle()` returned 200 and posted to that address.
- **R1, avatar SSRF: rejected** (`src/avatar.js:4`). The `user` value is URL-encoded and placed under `/u/` on a fixed host, so `/` and `@` can't change where the server sends the request. The report's payload becomes `https://avatars.example-cdn.net/u/%2F%2F169.254.169.254%2Flatest%2Fmeta-data.png`.
- **R3, SQL injection: rejected** (`src/users.js:4`). `sort` can only pick from a fixed list of columns (name, created, email), and anything else becomes `created_at`. The direction is forced to `ASC` or `DESC`. The report's payload produces `... ORDER BY created_at DESC LIMIT 50`.