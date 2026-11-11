Use `fs.rmSync(dir, { recursive: true })` to fix this. Add `force: true` if you also want no error when the folder doesn't exist, which is the `rm -rf` behaviour. I ran both the failing call and the fix on local Node v22.23.4, and the answer is saved in `ANSWER.md`. I didn't commit it.

**Options the Node 22 docs list for `fs.rmSync`** (read from https://nodejs.org/docs/latest-v22.x/api/fs.html#fsrmsyncpath-options, which showed v22.23.4):

| Option | Type | Default | What it does |
|---|---|---|---|
| `force` | boolean | `false` | Ignores the error when the path doesn't exist |
| `maxRetries` | integer | `0` | Retries on `EBUSY`, `EMFILE`, `ENFILE`, `ENOTEMPTY` or `EPERM`, waiting a bit longer each time. Only applies when `recursive` is `true` |
| `recursive` | boolean | `false` | Removes the directory and everything in it |
| `retryDelay` | integer | `100` | Milliseconds between retries. Only applies when `recursive` is `true` |

**What happened when I ran it:**
- **Non-empty folder, no options:** it throws `ERR_FS_EISDIR` ("Path is a directory").
- **Same folder with `{ recursive: true }`:** it's removed.
- **`force` alone:** it doesn't fix this error. It only stops the error when the path is missing (`ENOENT`).

Judging by the wording of the error, `rmSync` without `recursive` probably rejects empty folders too, but I only tested a non-empty one.

The skill's `hs` and `receipts` steps were skipped, as you asked.