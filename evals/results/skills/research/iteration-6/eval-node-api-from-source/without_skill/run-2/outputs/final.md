Use `fs.rmSync(dir, { recursive: true })` to delete the folder. Add `force: true` as well if you don't want an error when the folder doesn't exist (the same as `rm -rf`). I saved the answer in `ANSWER.md` in the repo and didn't commit it.

**Options the Node 22 docs list for `fs.rmSync`:**

| Option | Default | What it does |
|---|---|---|
| `force` | `false` | Doesn't throw if the path doesn't exist. |
| `maxRetries` | `0` | Retries after `EBUSY`, `EMFILE`, `ENFILE`, `ENOTEMPTY` or `EPERM` errors, waiting longer each time. Only works with `recursive: true`. |
| `recursive` | `false` | Removes the folder and everything inside it. **This is the fix.** |
| `retryDelay` | `100` ms | Wait between retries. Only works with `recursive: true`. |

**What I saw when I ran it on Node v22.23.4:**
- Without `recursive`, `rmSync` throws `ERR_FS_EISDIR` on any folder, empty ones included. So the problem isn't really about the folder having files in it.
- `{ force: true }` on its own still throws. It only suppresses the error when the path is missing.
- `{ recursive: true }` deletes the folder.

The option list and defaults come from the official Node 22 `fs` documentation page.