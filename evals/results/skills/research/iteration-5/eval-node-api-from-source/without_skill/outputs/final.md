Use `recursive: true`: `fs.rmSync(dir, { recursive: true })`. Add `force: true` as well if you want it to behave like `rm -rf` and not fail when the folder is missing. I saved the answer in `ANSWER.md` in the repo root but didn't commit it.

Node 22 documents four options for `fs.rmSync(path[, options])`:
- **`force`** (default `false`): no error if the path doesn't exist. This doesn't fix your problem.
- **`maxRetries`** (default `0`): how many times to retry after `EBUSY`, `EMFILE`, `ENFILE`, `ENOTEMPTY` or `EPERM` errors, waiting a bit longer each time. It only works with `recursive: true`.
- **`recursive`** (default `false`): deletes the directory and everything inside it. This is the fix.
- **`retryDelay`** (default `100` ms): the wait between retries. It also only works with `recursive: true`.

The defaults and descriptions are from the official Node 22 `fs` docs, not printed by Node itself. I ran the calls themselves on Node v22.23.4. Without `recursive`, `rmSync` throws `ERR_FS_EISDIR` for every directory, **empty ones too**, not just non-empty ones. With `recursive: true` the folder was deleted, and `force: true` stopped the error for a missing path.

The repo only contains `QUESTION.md`, so I couldn't find or change the actual `fs.rmSync(dir)` call.