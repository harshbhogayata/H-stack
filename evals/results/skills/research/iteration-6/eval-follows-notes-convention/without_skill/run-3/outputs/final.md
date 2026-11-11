No, Node 22's global `fetch()` does not use `HTTPS_PROXY` by default. Since v22.21.0 you can turn it on with either `NODE_USE_ENV_PROXY=1` or the `--use-env-proxy` flag; if both are set, the flag wins.

**Node's documentation:**
- The v22 CLI docs list both switches as "Added in: v22.21.0" and marked "Active Development". Both say "When enabled, Node.js parses the `HTTP_PROXY`, `HTTPS_PROXY` and `NO_PROXY` environment variables…", so it is off unless you enable it.
- The man page that comes with the installed Node adds that this "currently only affects requests sent over `fetch()`". Under this switch, Node's other built-in HTTP and HTTPS calls don't go through the proxy.

**Test on the installed Node (v22.23.4):** I set `HTTPS_PROXY` to a local proxy that logged every request, then ran `fetch()` three ways:

| Mode | Did the proxy see the request? |
|---|---|
| Default | No: `fetch()` connected directly and ignored the proxy |
| `NODE_USE_ENV_PROXY=1` | Yes |
| `--use-env-proxy` | Yes |

With either switch on, Node prints a warning that the proxy feature is experimental, so its behaviour may still change.

Versions before 22.21.0 have no built-in switch. On those, you have to set a proxy in code, for example with the `undici` package's `EnvHttpProxyAgent`.

The findings are saved to `docs/research/2026-11-11-node22-fetch-https-proxy.md`, named to match the existing note in that folder. I haven't committed the file. The test script is at `/tmp/claude-0/-tmp-hs-bench-VTFiQa/0e50ef2b-9d0c-49fb-bad0-ee9b79fa3924/scratchpad/proxytest.mjs`.