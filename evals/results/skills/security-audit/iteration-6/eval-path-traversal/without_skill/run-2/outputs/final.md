`files.py` is 10 lines, and its one route has serious security problems.

## 1. Path traversal lets anyone read any file the server can read (Critical) — `files.py:10`

```python
name = request.args.get("file", "")
return send_file(os.path.join(UPLOADS, name))
```

The `file` value goes into the path without any checks. That opens two ways out of the uploads folder:
- **`../` sequences:** `GET /download?file=../../../etc/passwd` resolves to `/etc/passwd`.
- **Absolute paths:** `os.path.join` throws away the base folder when the second part starts with `/`. So `GET /download?file=/etc/passwd` serves `/etc/passwd` directly, with no `../` needed. Filters that only look for `..` miss this.

An attacker can read any file the process has access to: application source, `.env` files and config secrets, SSH keys, `/proc/self/environ` (environment variables, often containing credentials), and so on.

## 2. No login check (High) — `files.py:6-10`

The comment says "Any logged-in user", but nothing checks for a logged-in user. There is no `@login_required`, no session check and no token check. The endpoint is open to anyone who can reach it, which makes issue #1 exploitable without logging in.

## 3. No check that the file belongs to the user (High) — `files.py:8-10`

The comment also says users download "files they uploaded", but nothing ties a file to the user who uploaded it. Even with traversal fixed and login added, any logged-in user could download anyone else's upload by guessing or listing its filename.

## Smaller points
- **Error handling:** a missing file or a directory name raises an unhandled exception from `send_file`, which returns a 500 instead of a 404. If debug mode is on, the error page can leak details about the server.
- **Empty name:** an empty `file` parameter points at the uploads folder itself. That causes an error rather than a leak, but it shows there is no input validation at all.

## Suggested fix

```python
import os
from flask import Flask, request, send_from_directory, abort, session
from werkzeug.utils import secure_filename

app = Flask(__name__)
UPLOADS = "/srv/app/uploads"

@app.get("/download")
def download():
    user_id = session.get("user_id")
    if not user_id:
        abort(401)

    name = secure_filename(request.args.get("file", ""))
    if not name:
        abort(400)

    # Per-user folder (or check ownership against a DB record of uploads)
    user_dir = os.path.join(UPLOADS, str(user_id))
    # send_from_directory uses safe_join: it rejects traversal and absolute paths and returns 404 if missing
    return send_from_directory(user_dir, name, as_attachment=True)
```

What the fix changes:
- **Path handling:** `send_from_directory` and `secure_filename` reject traversal and absolute paths, and return a 404 for missing files.
- **Login:** requests without a logged-in user get a 401.
- **Ownership:** files are stored per user, so users can't reach each other's uploads. A cleaner option is to look up the upload by an ID in the database, confirm `owner_id == current_user`, and serve its stored path. That way the user never supplies a filename at all.
- **Downloads only:** `as_attachment=True` makes the browser download the file instead of displaying it. This stops an uploaded HTML or SVG file from running scripts in your site's context.