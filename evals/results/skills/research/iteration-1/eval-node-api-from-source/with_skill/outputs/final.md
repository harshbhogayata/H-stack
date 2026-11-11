The fix is to pass `recursive: true`. Use `fs.rmSync(dir, { recursive: true, force: true })` if you want it to behave like `rm -rf`, which also means no error when the folder doesn't exist. I saved the answer, with sources, in `ANSWER.md` at the repo root. It isn't committed.

**Options the Node 22 docs list for `fs.rmSync`** ([nodejs.org, latest-v22.x](https://nodejs.org/docs/latest-v22.x/api/fs.html#fsrmsyncpath-options)):

| Option | Default | What it does |
|---|---|---|
| `force` | `false` | Ignores the error when the path doesn't exist. |
| `maxRetries` | `0` | Retries on `EBUSY`, `EMFILE`, `ENFILE`, `ENOTEMPTY` or `EPERM`, waiting longer each time. Only applies when `recursive` is `true`. |
| `recursive` | `false` | Deletes the folder and everything in it. |
| `retryDelay` | `100` | Milliseconds between retries. Only applies when `recursive` is `true`. |

**Tested on Node v22.23.4 with a small script:**
- Without `recursive`, `rmSync` throws `ERR_FS_EISDIR` on any folder, even an empty one. So the real cause is the missing `recursive` option, not that the folder has files in it.
- `force: true` on its own doesn't fix it; the call still throws.
- `recursive: true` deletes the folder and its contents.

The repo contains no source code besides `QUESTION.md`, so I couldn't look at the actual `fs.rmSync(dir)` call.