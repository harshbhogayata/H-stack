The option that fixes it is `recursive: true`:

```js
fs.rmSync(dir, { recursive: true, force: true });
```

Leave out `force: true` if you want an error when the folder is already gone; with it, a missing folder is silently ignored.

**The four options the Node 22 docs list for `fs.rmSync`** ([docs page](https://nodejs.org/docs/latest-v22.x/api/fs.html#fsrmsyncpath-options), v22.23.5):

| Option | Default | What it does |
|---|---|---|
| `recursive` | `false` | Deletes the folder and everything in it, retrying operations that fail. |
| `force` | `false` | Ignores the error when the path doesn't exist. |
| `maxRetries` | `0` | How many times to retry on `EBUSY`, `EMFILE`, `ENFILE`, `ENOTEMPTY` or `EPERM`, waiting a bit longer each time. Only works with `recursive: true`. |
| `retryDelay` | `100` | Milliseconds between retries. Only works with `recursive: true`. |

**What I saw when I ran it locally on Node v22.23.4:**
- **No options:** `fs.rmSync(dir)` throws `ERR_FS_EISDIR` for empty folders too, not just ones with files. Without `recursive`, it refuses to delete any directory.
- **`force: true` alone:** still throws on a directory. It only stops the error for a path that doesn't exist.
- **`recursive: true`:** deleted the folder.

I read the option list through a web-fetch tool that summarises pages; my request to read Node's source file on GitHub wasn't allowed. The run results above back up the parts that matter here.

The answer, with sources and test results, is saved in `ANSWER.md` at the repo root; the repo had no existing place for notes like this.