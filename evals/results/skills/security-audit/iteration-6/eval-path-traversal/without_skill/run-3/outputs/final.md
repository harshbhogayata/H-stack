I found two serious problems in `files.py`. Both are in a 10-line handler.

## 1. Path traversal lets anyone read any file on the server (Critical) — `files.py:10`

```python
return send_file(os.path.join(UPLOADS, name))
```

`name` comes straight from the query string and is never checked. There are two ways to escape the uploads folder:

- **`../` sequences:** `/download?file=../../../etc/passwd` resolves to `/etc/passwd`.
- **Absolute paths:** if any later argument to `os.path.join` is an absolute path, everything before it is dropped. So `/download?file=/etc/passwd` returns `/etc/passwd` directly, and no `../` is needed.

An attacker can read anything the app's process can read: source code, `.env` files, config secrets, SSH keys, database files, and so on.

**Fix:** use Flask's `send_from_directory`. It uses `werkzeug.security.safe_join` and refuses any path that resolves outside the folder:

```python
from flask import send_from_directory, abort

return send_from_directory(UPLOADS, name)  # raises 404 if the path leaves UPLOADS
```

## 2. No authentication or ownership check (High) — `files.py:6-10`

The comment says *"Any logged-in user can download files they uploaded"*, but the code checks neither condition:

- **Not logged in:** there is no login check, so anonymous users can call the endpoint.
- **Not the owner:** fixing the path traversal still leaves every user able to read every other user's uploads by guessing or listing filenames (an IDOR).

**Fix:** require a logged-in session, then confirm the requested file belongs to the current user before serving it. Two common ways to do that:

- Look up the file by an opaque ID in the database, with a row like `(id, owner_id, stored_path)`, and check `owner_id == current_user.id`.
- Store each user's uploads under their own folder, such as `UPLOADS/<user_id>/`, and serve with `send_from_directory` rooted at that folder.

## Smaller points
- **Files rendered in the browser:** `send_file` serves files inline with a guessed content type. If users can upload HTML or SVG, a download link becomes stored XSS on your domain. Serving with `as_attachment=True` (which tells the browser to save the file instead of displaying it) plus `X-Content-Type-Options: nosniff` closes that off.
- **Confusing errors:** a missing or empty `file` parameter currently tries to serve the directory itself and raises an error. Return a clean 400 or 404 instead.

## Suggested shape

```python
@app.get("/download/<int:file_id>")
@login_required
def download(file_id):
    f = Upload.query.get_or_404(file_id)
    if f.owner_id != current_user.id:
        abort(404)
    return send_from_directory(UPLOADS, f.stored_name, as_attachment=True)
```

I haven't changed the file. I can apply a fix if you tell me which auth setup the app uses (for example Flask-Login or your own session handling).