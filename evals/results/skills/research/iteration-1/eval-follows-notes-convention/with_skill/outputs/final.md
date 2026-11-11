**No.** On Node 22, global `fetch()` ignores `HTTPS_PROXY` (and `HTTP_PROXY`, plus the lowercase versions) unless you turn proxy support on with `NODE_USE_ENV_PROXY=1` or the `--use-env-proxy` flag.

Findings are saved to `docs/research/2026-11-11-node22-fetch-https-proxy.md`, next to the existing note in `docs/research/`.

Everything was checked against the installed Node v22.23.4. My web fetches weren't approved, so I used the documentation and source that ship with that binary:

- **Docs:** the bundled man page (`node.1`, lines 848–859) says that when `NODE_USE_ENV_PROXY` is enabled, Node reads the proxy variables at startup. It adds that this "currently only affects requests sent over fetch()". It is off unless you set it.
- **Source:** `setupHttpProxy()` in `lib/internal/process/pre_execution.js`, read from the running binary, returns early unless the opt-in is set. A TODO comment there says it is kept off by default so it doesn't clash with libraries that set up their own proxy handling.
- **Test:** I ran a fake local proxy and fetched an unreachable test address:
  - **`HTTPS_PROXY` alone:** the request went direct and failed DNS lookup (`ENOTFOUND`); the proxy received nothing.
  - **With `NODE_USE_ENV_PROXY=1` or `--use-env-proxy`:** the request went through the proxy, and Node printed an "experimental" warning.
  - **With the opt-in and `NO_PROXY` set:** the proxy was skipped.

Not yet answered:
- I don't know which 22.x release first added `NODE_USE_ENV_PROXY`. The online docs would say, but I couldn't reach them. Releases before it have no built-in proxy support for `fetch()` at all, so the answer is still no.
- In this version's source, the `http` and `https` modules also read the opt-in, even though the man page mentions only `fetch()`. I didn't test whether they actually use the proxy.