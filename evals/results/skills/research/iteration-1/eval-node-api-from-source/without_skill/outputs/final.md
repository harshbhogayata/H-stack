The answer is saved in `ANSWER.md` at the repo root.

**Options Node 22 documents for `fs.rmSync(path, options)`:**
- `force` (default `false`): don't throw if the path doesn't exist.
- `recursive` (default `false`): remove the directory and everything in it.
- `maxRetries` (default `0`): how many times to retry after errors like `EBUSY`, `ENOTEMPTY` or `EPERM`. Only applies when `recursive` is `true`.
- `retryDelay` (default `100` ms): how long to wait between retries. Only applies when `recursive` is `true`.

**The fix is `recursive: true`:**
```js
fs.rmSync(dir, { recursive: true, force: true }); // like rm -rf
```

I tested this on Node v22.23.4:
- **It isn't about the folder having files.** Without `recursive`, `rmSync` throws `ERR_FS_EISDIR` on *any* directory, including an empty one.
- **`force: true` alone doesn't help.** It still throws `ERR_FS_EISDIR` and only stops the error when the path is missing.
- **`recursive: true` works.** It deleted the folder and its contents.

I couldn't find an `fs.rmSync` call in this repo; it only has `QUESTION.md`. So I tested on a temporary folder rather than your actual code.