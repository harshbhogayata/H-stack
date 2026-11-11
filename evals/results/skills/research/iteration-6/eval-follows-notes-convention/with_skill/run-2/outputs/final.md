No. In Node 22, global `fetch()` ignores `HTTPS_PROXY` unless you turn proxy support on with `NODE_USE_ENV_PROXY=1` or `--use-env-proxy`.

- **Opt-in exists only from v22.21.0:** Node's v22 docs show both settings "Added in: v22.21.0" as an experimental feature still being developed. Once on, Node reads `HTTP_PROXY`, `HTTPS_PROXY` and `NO_PROXY` at startup and sends requests through the proxy. The docs' "Built-in Proxy Support" section says the proxy is used only when one of the two is set ([cli.html](https://nodejs.org/docs/latest-v22.x/api/cli.html#--use-env-proxy), [http.html](https://nodejs.org/docs/latest-v22.x/api/http.html#built-in-proxy-support)).
- **Tested on the installed Node v22.23.4:** I pointed `HTTPS_PROXY` at a fake local proxy.
  - With `HTTPS_PROXY` alone, the proxy received nothing and `fetch` tried to connect directly.
  - With `NODE_USE_ENV_PROXY=1` or `--use-env-proxy` added, the proxy received the `CONNECT` request, so `fetch` was proxied.
- **Not confirmed from source:** those docs pages don't mention `fetch()` by name. I also couldn't read the Node source because the network request wasn't approved. So the claim that the opt-in also covers `fetch()` rests on the local test.
- **Not tested:** Node 22 releases before v22.21.0. They should have no built-in way to do this, based on the version markers in the docs.

The findings, with sources, the test output and these open questions, are saved in `docs/research/2026-11-11-node22-fetch-https-proxy.md`, next to the existing research note. Nothing is committed.