No. In Node 22, global `fetch()` ignores `HTTPS_PROXY` by default. It only uses the proxy if you start Node with `--use-env-proxy` or set `NODE_USE_ENV_PROXY=1`.

I checked this against the installed Node, v22.23.4, in three ways:

- **Source code:** I pulled `setupHttpProxy()` from the code built into the Node binary. It exits early unless the opt-in is set, and only then makes `fetch()` use the proxy settings. A comment in the code says turning this on by default is still an open item.
- **`node --help`:** it lists `--use-env-proxy` as the switch that makes Node read `HTTP_PROXY`, `HTTPS_PROXY` and `NO_PROXY`.
- **Live test:** I pointed `HTTPS_PROXY` at a local proxy and called `fetch()`. With only the environment variable set, the request bypassed the proxy and failed on the direct lookup. With either opt-in, the proxy received the request, for both `http:` and `https:` URLs.

One thing I couldn't confirm: which 22.x release first added these opt-ins. Web access wasn't approved here, so I couldn't read Node's online docs for the version history. From memory it was around v22.21.0, but the write-up marks that as unconfirmed and links the docs pages to check. Earlier 22.x versions have no built-in option; there you'd install the `undici` package and set its proxy agent yourself.

The findings are saved in `docs/research/2026-11-11-node22-fetch-https-proxy.md`, following the naming of the existing note in that folder. I haven't committed it.