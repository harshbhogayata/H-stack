I found two serious problems in `files.py`, which is only 10 lines.

## 1. Path traversal lets anyone read any file on the server (critical)
`files.py:10`: `os.path.join(UPLOADS, name)` takes `name` straight from the query string, and nothing checks it.

- **`../` sequences:** `/download?file=../../../etc/passwd` resolves to `/etc/passwd`.
- **Absolute paths:** `os.path.join` throws away everything before an absolute component. So `/download?file=/etc/shadow` becomes `/etc/shadow`, and `UPLOADS` is ignored completely.

An attacker can download any file the app's process can read. That includes source code, `.env` and config files, SSH keys and database files.

## 2. No authentication or ownership check (high)
The comment says "Any logged-in user can download files they uploaded," but the code does neither:
- **No login check:** an anonymous visitor can call the endpoint.
- **No ownership check:** files aren't tied to a user, so anyone who knows or guesses a filename can download another user's upload. This is an IDOR (insecure direct object reference).

## Smaller issues
- An empty or missing `file` parameter makes the code try to send the uploads directory itself, which causes a 500 error instead of a clean 400 or 404.
- Running the app with Flask's debug mode on would let these errors show stack traces and server details.

## Suggested fix
```python
import os
from flask import Flask, request, send_from_directory, abort
from flask_login import login_required, current_user  # or your auth layer

app = Flask(__name__)
UPLOADS = "/srv/app/uploads"

@app.get("/download")
@login_required
def download():
    name = request.args.get("file", "")
    if not name:
        abort(400)
    # Ownership check: look the file up for this user, e.g.
    # record = Upload.query.filter_by(owner_id=current_user.id, name=name).first_or_404()
    user_dir = os.path.join(UPLOADS, str(current_user.id))
    # send_from_directory uses safe_join: rejects "..", absolute paths, etc.
    return send_from_directory(user_dir, name, as_attachment=True)
```

What the fix changes:
- **`send_from_directory`** (it uses `werkzeug.security.safe_join` internally) replaces `send_file(os.path.join(...))`. It returns a 404 for any path that would land outside the base directory.
- **Ownership:** the safest way is to store uploads under per-user directories, or better, as database rows that map an opaque ID such as a UUID to the owner and the file path on disk. The client then sends only the ID.
- **`as_attachment=True`** makes the browser download the file instead of opening it. Otherwise an uploaded HTML or SVG file would run in the browser under your site's origin, which is stored XSS.

I haven't changed the file. Tell me if you want me to apply the fix, and which auth library the app uses.