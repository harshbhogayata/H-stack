No, Node 22's built-in `fetch()` ignores `HTTPS_PROXY` by default. It only uses the proxy if you turn it on with `NODE_USE_ENV_PROXY=1` or the `--use-env-proxy` flag. The findings are saved in `docs/research/2026-11-11-node22-fetch-https-proxy.md`.

I couldn't reach the online Node docs or GitHub from here, so the evidence comes from the installed Node 22 (v22.23.4):

- **Node's own source code**, which is built into the program file: the function that sets up the proxy returns straight away unless one of those two settings is on. It also contains a note from the developers that turning it on by default is still being looked into.
- **`node --help`:** it lists `--use-env-proxy` as the option that makes Node read `HTTP_PROXY`, `HTTPS_PROXY` and `NO_PROXY`.
- **A local test:** I pointed `HTTPS_PROXY` at a fake proxy on my machine and called `fetch()`.
  - With only `HTTPS_PROXY` set, the proxy received nothing and `fetch()` tried to connect directly.
  - With either opt-in setting, the request went through the proxy.
  - When turned on, Node warns that this proxy support is still experimental.

I couldn't confirm which Node 22 release first added these settings. My recollection is that it was backported in v22.21.0, and that older 22.x releases don't have them at all. The note marks this as unverified.

I haven't committed the file.