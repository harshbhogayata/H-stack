The fix is `fs.rmSync(dir, { recursive: true })`. I saved the answer in `ANSWER.md`.

**The four options Node 22 documents for `fs.rmSync(path[, options])`:**
- **`force`** (default `false`): if `true`, no error is thrown when the path doesn't exist.
- **`recursive`** (default `false`): if `true`, the directory and everything in it are removed.
- **`maxRetries`** (default `0`): how many times to retry on `EBUSY`, `EMFILE`, `ENFILE`, `ENOTEMPTY` or `EPERM`, waiting a bit longer each time. It only applies when `recursive` is `true`.
- **`retryDelay`** (default `100` ms): the wait between those retries. It also only applies when `recursive` is `true`.

`force` on its own doesn't fix this, because it only hides "doesn't exist" errors. A common choice is `{ recursive: true, force: true }`.

Without `recursive`, `rmSync` throws `ERR_FS_EISDIR` on any directory, empty or not.

I tested this on the installed Node v22.23.4:
- A plain call on a folder threw `ERR_FS_EISDIR`.
- With `recursive: true`, the folder and its contents were deleted.
- `force: true` stopped the error for a path that doesn't exist.

The option list and defaults come from my knowledge of the Node 22 docs; I didn't open the docs page in this session. `ANSWER.md` links to it. I didn't commit the file.