I wrote `findings.json`. It has one confirmed issue and three suspicions I checked and ruled out. I didn't change anything in `app/` or `config/`.

**Confirmed: any signed-in user can run shell commands on the server through `/api/log`** (`app/tasks.py:23`)
- The branch-name check (`BRANCH_RE`) only looks at the start of the value. It matches the first character and stops, without requiring the whole string to be valid. So `branch=main; id` passes.
- That value is then put into a shell command (`subprocess.run(..., shell=True)` in `_git`, `app/tasks.py:11`), and the command's output is sent back in the response.
- The result is that any employee can run any command as the service account and read what it can read, such as server secrets like `DEPLOY_TOKEN`.
- I checked the regex directly against `main; cat /etc/passwd` and it passes. I didn't run the endpoint end to end, because `/srv/ops/repo` doesn't exist here.
- The fix is to use `fullmatch` (or add `\Z` to the pattern), stop using `shell=True`, and put `--` before the branch name.

**Rejected (checked, not exploitable):**
- **`/api/commit`** uses the same shell call, but the commit hash must be 7–40 hex characters and the check covers the whole value. Injected characters and trailing newlines are rejected.
- **`/api/report`** resolves `..` and symlinks before checking that the file is inside the reports folder. Traversal like `../../config/deploy.env` and absolute paths like `/etc/passwd` were both refused when I tried them.
- **`/api/deploys`** only reads plain literals from the filter, so code such as `__import__(...)` is rejected and can't run. The filter only searches a fixed list every user can already see. A very deeply nested filter could crash the request with a server error, but that doesn't cross a security boundary.