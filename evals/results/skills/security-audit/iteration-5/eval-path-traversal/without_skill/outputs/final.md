I found three serious problems in `files.py`. Any anonymous visitor can read any file on the server that the app's process can read.

### 1. Path traversal — Critical (`files.py:10`)
```python
return send_file(os.path.join(UPLOADS, name))
```
`name` comes straight from the query string and is never checked. There are two ways to abuse it:
- **Relative traversal:** `/download?file=../../../etc/passwd` resolves to `/etc/passwd`.
- **Absolute path:** `os.path.join` throws away the earlier parts when a later part is absolute, so `/download?file=/etc/passwd` gives `/etc/passwd` without any `../`.

An attacker can use this to read source code, `.env` files, SSH keys, cloud credentials and `/proc/self/environ`. That usually leads to taking over the whole app.

### 2. No authentication — High (`files.py:6-10`)
The comment says "Any logged-in user can download…", but nothing checks for a login. There's no `@login_required`, no session check and no `before_request` hook. The endpoint is open to everyone.

### 3. No ownership check (IDOR) — High (`files.py:8-10`)
Adding a login check still wouldn't enforce "files *they* uploaded". The code never looks up who owns the file. Any user who can guess or list a filename can download other users' uploads.

### 4. Uploaded content served inline — Medium (`files.py:10`)
`send_file` guesses the MIME type from the file extension and serves the file inline. If users can upload `.html` or `.svg` files, those files run in the app's own origin. That's stored XSS, which can steal sessions. Serve uploads with `as_attachment=True` and `X-Content-Type-Options: nosniff`, or from a separate cookieless domain.

### Minor
- An empty `file` parameter (the default) points `send_file` at the uploads directory itself, which returns an unhandled error (500).

### Suggested fix
```python
from flask import abort, send_from_directory
from flask_login import login_required, current_user

@app.get("/download")
@login_required
def download():
    name = request.args.get("file", "")
    if not name:
        abort(400)
    record = Upload.query.filter_by(filename=name, owner_id=current_user.id).first()
    if record is None:
        abort(404)  # 404, not 403, so the endpoint doesn't reveal which files exist
    # send_from_directory uses safe_join and rejects ../ and absolute paths
    return send_from_directory(UPLOADS, record.stored_name, as_attachment=True)
```
It's better still to store uploads under random server-generated IDs and look them up in the database. That way user input never becomes a filesystem path.

`Upload` and `flask_login` are placeholders. The repo has only this one file, so I couldn't see how this app handles login or records uploads. I haven't changed anything; I can apply the fix if you tell me which auth setup and upload model to use.