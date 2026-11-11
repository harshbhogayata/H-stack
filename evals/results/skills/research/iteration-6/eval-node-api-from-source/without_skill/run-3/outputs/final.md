Pass `{ recursive: true }`: `fs.rmSync(dir, { recursive: true })` deletes the folder and everything in it. I saved the full answer in `ANSWER.md` in the repo; it isn't committed.

**The options Node 22 lists for `fs.rmSync(path[, options])`:**

| Option | Default | What it does |
|---|---|---|
| `force` | `false` | Doesn't throw if the path doesn't exist. |
| `maxRetries` | `0` | How many times to retry on `EBUSY`, `EMFILE`, `ENFILE`, `ENOTEMPTY` or `EPERM`. Only used when `recursive` is `true`. |
| `recursive` | `false` | Deletes the directory and everything inside it. |
| `retryDelay` | `100` | Milliseconds to wait between retries. Only used when `recursive` is `true`. |

**Which one fixes it:** `recursive: true`. `force` doesn't help, because it only stops the error when the path is missing. If you want the same behaviour as `rm -rf`, use `{ recursive: true, force: true }`.

**One correction to the question:** the error isn't about the folder having files in it. Without `recursive`, `fs.rmSync` throws `ERR_FS_EISDIR` ("Path is a directory") on any folder, even an empty one.

I checked all of this on Node v22.23.4:
- **Error:** a non-empty and an empty folder both threw `ERR_FS_EISDIR`.
- **Fix:** `recursive: true` removed the folder.
- **Missing path:** `force: true` made it stop throwing.
- **Defaults:** they match Node's own option-checking code: `{ recursive: false, force: false, retryDelay: 100, maxRetries: 0 }`.

The option descriptions are from my memory of the official v22 docs; I didn't fetch the page.