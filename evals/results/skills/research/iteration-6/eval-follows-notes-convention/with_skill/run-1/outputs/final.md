**No.** In Node 22, global `fetch()` ignores `HTTPS_PROXY` unless you opt in. Findings are saved in `docs/research/2026-11-11-node22-fetch-https-proxy.md`, next to the existing research note.

- **Turning it on:** from Node 22.21.0 (released 2025-10-20) you can opt in with either the `NODE_USE_ENV_PROXY=1` environment variable or the `--use-env-proxy` flag. Node's changelog lists both as new in that release (PRs #57165 and #59151). On Node 22 versions before 22.21.0, there's no built-in opt-in, so you'd have to set undici's `EnvHttpProxyAgent` as the global dispatcher yourself. I didn't test that workaround.
- **What Node's docs say:** the manual page installed with Node 22.23.4 says `NODE_USE_ENV_PROXY` reads `HTTP_PROXY`, `HTTPS_PROXY` and `NO_PROXY` at startup and "currently only affects requests sent over fetch()".
- **Test on Node 22.23.4:** I ran a fake local proxy that logs incoming requests:
  - With only `HTTPS_PROXY` set, `fetch()` went direct and the proxy received nothing.
  - With `NODE_USE_ENV_PROXY=1`, and again with `--use-env-proxy`, the proxy received `CONNECT example.invalid:443`.
  - Both opt-ins print a warning that `EnvHttpProxyAgent` is experimental.

I wasn't allowed web access in this run, so I couldn't check the online docs at nodejs.org. Everything above comes from the docs and changelog installed with Node 22.23.4, plus the test. The file lists this as an open question.