I found one real vulnerability in the four routes. I wrote it up in `findings.json` with the three suspicions I checked and ruled out. The finding comes from reading the code; I didn't send any requests to a running server, and I didn't change `app/` or `config/`.

**Confirmed: anyone signed in can run shell commands through `/api/log`** (`app/tasks.py:24`)
- Example request: `branch = "main; id; cat /etc/passwd"`.
- The branch-name check (`BRANCH_RE`, `app/tasks.py:7`) only looks at the start of the value. It accepts anything that begins with a letter or digit, so `;`, `$()`, `|` and backticks get through after that first character.
- The value then goes straight into a shell command (`subprocess.run(..., shell=True)` at `app/tasks.py:11`), and the output comes back in the response.
- So any employee can run commands as the service account. For example, they could read `DEPLOY_TOKEN` from `config/deploy.env`.
- To fix it, either check the whole value (use `fullmatch`, or end the pattern with `$`) or stop using the shell: `subprocess.run(["git", "log", "--oneline", "-n", "20", "--end-of-options", branch])`.

**Checked and ruled out:**
- **`/api/commit`** also builds a shell command, but its input check matches the whole value and only allows 7–40 lowercase hex characters. Nothing can be injected.
- **`/api/report`** resolves the full path, including symlinks, and refuses anything outside the reports folder. I tried `../` paths, absolute paths, a sibling folder whose name starts with `reports` and an empty name; all of them are rejected.
- **`/api/deploys`** reads the filter as a plain data value (`ast.literal_eval`), so it can't run code. It only filters a short built-in list of deploys that isn't sensitive.