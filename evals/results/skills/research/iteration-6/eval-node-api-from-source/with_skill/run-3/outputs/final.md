The fix is `recursive: true`. Change the call to `fs.rmSync(dir, { recursive: true })`, or add `force: true` as well if it also shouldn't throw when the folder is already gone (like `rm -rf`).

Node 22's docs list four options for `fs.rmSync` ([source](https://nodejs.org/docs/latest-v22.x/api/fs.html#fsrmsyncpath-options)):

| Option | Default | What it does |
|---|---|---|
| `force` | `false` | Doesn't throw if the path doesn't exist. |
| `recursive` | `false` | Deletes the directory and everything in it, retrying operations that fail. |
| `maxRetries` | `0` | Number of retries on errors like `EBUSY`, `ENOTEMPTY` or `EPERM`. Only applies when `recursive` is on. |
| `retryDelay` | `100` | Milliseconds to wait between those retries. Only applies when `recursive` is on. |

I tested it on Node v22.23.4:
- **Without `recursive`, any folder fails, not just non-empty ones.** An empty folder also throws `ERR_FS_EISDIR`, so the "non-empty" description is slightly off.
- **With `recursive: true`,** the folder and its contents were removed.
- **`force` alone doesn't fix this.** It only stops the error when the path is missing; a missing path throws `ENOENT` without it.

If you only ever want to remove empty folders, `fs.rmdirSync(dir)` is meant for that, but I didn't test it.

I couldn't use `curl` (permission was blocked), so I read the docs from nodejs.org instead. The answer is saved in `ANSWER.md` at the repo root, with each claim marked as read from the docs, tested, or inferred.