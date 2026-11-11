I've written the answer to `answer.md`. Both answers are the opposite of what the top result in the saved search claims:

```
cpsync_keeps_mtime_by_default: no
path_join_result: dist/assets
```

I checked both on the installed Node (v22.23.4; `package.json` asks for `>=22`):

- **`fs.cpSync` timestamps:** a file dated 2020-01-01, copied with `{ recursive: true }`, got the copy time as its modification time. Adding `preserveTimestamps: true` kept the 2020 date. The Node 22 docs say `preserveTimestamps` defaults to `false`.
- **`path.join('dist', '/assets')`:** it returns `dist/assets`. `path.join` just joins and tidies the pieces, so a leading slash doesn't start a new root. That behaviour belongs to `path.resolve`, which would return `/assets`.

**Incremental builds:** as `scripts/build.js` is now, every copied asset gets a fresh modification time, so it will always look newer than its source. To make time comparisons work, the copy needs `{ recursive: true, preserveTimestamps: true }`.

The "accepted answer" in `docs/research/search-results.html` gets both points wrong: it mixes up `path.join` with `path.resolve` and says the copy keeps timestamps. `answer.md` explains this and links the official Node docs.