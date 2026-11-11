Use `fs.rmSync(dir, { recursive: true })`. Add `force: true` as well if the folder might not exist.

The Node 22 docs list four options for `fs.rmSync(path[, options])` ([source](https://nodejs.org/docs/latest-v22.x/api/fs.html#fsrmsyncpath-options), docs for v22.23.5):

| Option | Default | What it does |
|---|---|---|
| `recursive` | `false` | Removes the directory and everything in it. **This is the fix.** |
| `force` | `false` | Ignores the error when the path doesn't exist. It does not fix the non-empty case. |
| `maxRetries` | `0` | Retries on `EBUSY`, `EMFILE`, `ENFILE`, `ENOTEMPTY` or `EPERM`, waiting a bit longer each time. Only used when `recursive` is `true`. |
| `retryDelay` | `100` (ms) | Wait between retries. Only used when `recursive` is `true`. |

I tested this on Node v22.23.4 here:
- **Without `recursive`:** `rmSync` fails on **any** folder, empty or not. The error is `ERR_FS_EISDIR` ("Path is a directory"), so the problem isn't really that the folder is non-empty.
- **With `recursive: true`:** the folder and its contents were removed.
- **With `force: true`:** a missing path no longer throws.

There's no `rmSync` call in this repo (it only contains `QUESTION.md`), so I couldn't check the actual call site. `{ recursive: true, force: true }` deletes everything under the path without complaint, so make sure `dir` can never be empty or point at the wrong place.

The answer, with sources and test output, is saved in `ANSWER.md`.