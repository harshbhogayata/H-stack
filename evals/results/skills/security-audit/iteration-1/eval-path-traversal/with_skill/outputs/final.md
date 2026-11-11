I reviewed `files.py` with the security-audit skill as a focused review, not a full audit, so I didn't create any audit files. The file is 10 lines with one route, and I didn't run it. Both findings come from reading the code.

## 1. Path traversal lets anyone read any file the server can read (high)

`files.py:9-10`
```python
name = request.args.get("file", "")
return send_file(os.path.join(UPLOADS, name))
```
- **Input:** the `file` query parameter goes into the path with no checks.
- **Intended control:** downloads are supposed to stay inside `/srv/app/uploads`.
- **How it breaks:** `os.path.join` does nothing to stop `..` segments, and if the second argument is an absolute path it drops the base directory entirely:
  - `GET /download?file=../../../etc/passwd` gives `/srv/app/uploads/../../../etc/passwd`
  - `GET /download?file=/etc/passwd` gives `/etc/passwd`
- **Result:** the caller can read any file the app process can open. That includes app source, config, `.env` files, keys and database files, which often leads to a credential compromise.
- **Severity:** high. If no authentication sits in front of this route (see 2b), it's effectively critical, because an anonymous caller can read secrets.

**Fix:** use `send_from_directory(UPLOADS, name)`, which rejects `..` and absolute paths through `werkzeug.security.safe_join`. Add regression tests showing that `file=../x`, `file=/etc/passwd` and `file=..%2fx` all return 404.

## 2. No login or ownership check

The comment on line 8 says "any logged-in user can download files they uploaded," but the code enforces neither part.

**a) Users can read each other's files (confirmed from the code).** Every upload sits in one shared folder, and nothing checks who owns a file. Anyone who knows or guesses a filename gets another user's upload. This holds even after the traversal fix.
- **Fix:** look up the file by ID in a table that records its owner, and check that the owner is `current_user` before serving it. Or store uploads in per-user folders and serve with `send_from_directory(user_dir, name)`, where `user_dir` comes from the session and never from the request.

**b) Login requirement: needs checking, no severity given.** This file has no `@login_required`, no `before_request` hook and no session check. Login could still be enforced somewhere this file can't show, such as other app code, a reverse proxy or an auth gateway. To settle it, send `GET /download?file=<a known test file>` with no session cookie to a local instance and see if you get the file back. If you do, finding 1 becomes unauthenticated arbitrary file read.

## Smallest fix covering both
```python
from flask import abort, send_from_directory
from flask_login import login_required, current_user

@app.get("/download")
@login_required
def download():
    name = request.args.get("file", "")
    user_dir = os.path.join(UPLOADS, str(current_user.id))  # id from the session, not the request
    return send_from_directory(user_dir, name)  # safe_join rejects ../ and absolute paths
```
This assumes uploads are saved under a folder per user ID. If they aren't, use the database lookup from 2a instead.