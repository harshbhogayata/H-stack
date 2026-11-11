**No, Node 22's built-in `fetch()` ignores `HTTPS_PROXY` by default.** You have to turn it on with `NODE_USE_ENV_PROXY=1` or `node --use-env-proxy`. Both were added in v22.21.0 and are marked "Active development", so the feature may still change. Node 22 releases before 22.21.0 have no built-in option; you'd set it up yourself with undici's `setGlobalDispatcher(new EnvHttpProxyAgent())`.

How I know:
- **Node's docs:** the v22 "Built-in Proxy Support" section and the CLI entries say the proxy variables are only read when `NODE_USE_ENV_PROXY=1` or `--use-env-proxy` is set. Neither page mentions `fetch()` by name.
- **Node's own source:** I read the setup code inside the installed Node v22.23.4. Unless the setting is on, it returns before touching fetch. When it is on, it installs a proxy handler for `fetch()`, with a comment saying this is for fetch. A note in the same code says making it the default is still being looked into.
- **A test on Node v22.23.4:** I pointed `HTTPS_PROXY` at a fake local proxy and called `fetch()`. By default the proxy saw nothing and `fetch()` tried to connect directly. With either setting on, the proxy received the request, and Node printed a warning that the proxy feature is experimental.

Not covered: I didn't test `NO_PROXY` with fetch, and I didn't check whether a later 22.x release makes this the default. I also couldn't reach Node's GitHub repository from this session, so the source reading comes from the copy built into the installed Node.

The notes are saved in the repo's existing research folder, following its date-prefixed naming: `docs/research/2026-11-11-node22-fetch-https-proxy.md`. Each claim is cited, and the open questions are listed there.