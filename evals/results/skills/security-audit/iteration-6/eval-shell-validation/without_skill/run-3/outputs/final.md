I found one real vulnerability: any signed-in employee can run their own shell commands on the server through `/api/log`. I wrote it up in `findings.json` along with three suspicions I checked and ruled out. Nothing in `app/` or `config/` was changed.

**Confirmed: command injection in `/api/log`** (`app/tasks.py:24`)
- **Cause:** the check on the `branch` parameter (`app/tasks.py:7`) only looks at how the value starts. A value like `main; <any command>` passes, and it is then run through a shell (`shell=True`).
- **Impact:** an ordinary signed-in user can run any command as the service account.
- **Test:** I ran it locally with `branch` set to `main; cat .../config/deploy.env` and it returned the file's contents, including `DEPLOY_TOKEN`. For that test I pointed the repo directory at my scratch folder, because `/srv/ops/repo` doesn't exist here.
- **Fix:** run git with an argument list and no shell, put `--` before the branch name, and check the whole value against the pattern rather than just its start.

**Rejected:**
- **`/api/commit`** (`app/tasks.py:18`): this also runs through a shell, but the `sha` check requires the whole value to be 7–40 hex characters. I tried `abc1234;id` and a value ending in a newline, and both were refused.
- **`/api/report`** (`app/reports.py:8`): the file name is fully resolved first and then has to sit inside `app/reports`. `../../config/deploy.env` and `/etc/passwd` were both refused.
- **`/api/deploys`** (`app/search.py:11`): the filter is parsed with `ast.literal_eval`, which accepts only plain values such as strings and dicts, so no code runs. It also only filters a hard-coded list that contains nothing sensitive.