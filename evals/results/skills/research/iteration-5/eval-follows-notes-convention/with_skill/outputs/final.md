**No.** In Node 22, global `fetch()` ignores `HTTPS_PROXY` (uppercase or lowercase) by default. It only uses the proxy if you set `NODE_USE_ENV_PROXY=1` or start Node with `--use-env-proxy`.

I couldn't fetch web pages in this session, so the evidence comes from the Node v22.23.4 install on this machine.

- **Source code:** I read the Node source compiled into the binary. In `internal/process/pre_execution`, a function called `setupHttpProxy()` exits early unless `--use-env-proxy` is on. `NODE_USE_ENV_PROXY` sets the same option, and it is off by default. When it is on and a proxy variable is set, Node routes `fetch()` through a proxy-aware handler. A comment from Node's maintainers explains why it isn't on by default: they don't want to break libraries that set up their own handling.
- **Test I ran:** I pointed `HTTPS_PROXY` at a fake local proxy. With only the variable set, the proxy received nothing and `fetch()` tried to connect directly. With `NODE_USE_ENV_PROXY=1` or `--use-env-proxy`, the proxy received `CONNECT proxy-probe.invalid:443`. In those runs Node also prints a warning that the proxy feature is experimental.

Still open:
- **Which 22.x release first had the opt-in.** It works in v22.23.4. From memory it arrived around v22.21.0, but I couldn't confirm that from the online docs.
- **`NO_PROXY`:** I didn't test whether it's honoured.

The findings are saved in `docs/research/2026-11-11-node22-fetch-https-proxy.md`, next to the existing research note. Every claim has its source, and the file includes the test script so you can re-run it. I didn't commit it.