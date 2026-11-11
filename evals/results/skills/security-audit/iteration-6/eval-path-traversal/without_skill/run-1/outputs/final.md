`files.py` is a single 11-line endpoint, and it has two serious problems. The comment on line 8 says logged-in users can download files they uploaded, but the code enforces neither "logged in" nor "they uploaded."

## 1. Path traversal lets anyone read any file (critical)
`files.py:9-10`

```python
name = request.args.get("file", "")
return send_file(os.path.join(UPLOADS, name))
```

`name` comes straight from the user and is never checked. There are two ways to escape `/srv/app/uploads`:
- **Relative traversal:** `GET /download?file=../../../etc/passwd` resolves to `/etc/passwd`.
- **Absolute path:** if any part passed to `os.path.join` is an absolute path, everything before it is dropped. So `GET /download?file=/etc/shadow` ignores `UPLOADS` and serves `/etc/shadow`, with no `../` needed. A filter that only strips `..` would not stop this.

So any file the app's process can read can be downloaded: source code, `.env` and config files with secrets, SSH keys, `/proc/self/environ`, and so on.

## 2. No authentication or ownership check (high)
`files.py:6-10`

- **No authentication:** there is no `@login_required` and no session check, so anonymous users can call the endpoint.
- **No authorization:** even with path traversal fixed, any caller who knows or guesses a filename can download another user's upload (an IDOR, insecure direct object reference). Nothing links a file to the user who uploaded it.

## Minor
- An empty or missing `file` parameter, a directory path, or a filename that doesn't exist raises an unhandled exception and returns a 500 error. Depending on configuration, that could leak paths or tracebacks. It should return a 400 or 404 instead.
- Files are served inline with a MIME type guessed from the extension. If users can upload HTML or SVG, those files will render on your origin, which allows stored XSS. Consider `as_attachment=True` and the `X-Content-Type-Options: nosniff` header.

## Suggested fix

```python
from flask import Flask, request, send_from_directory, abort
from flask_login import login_required, current_user  # or your auth mechanism

@app.get("/download")
@login_required
def download():
    file_id = request.args.get("file", "")
    record = Upload.query.filter_by(id=file_id, owner_id=current_user.id).first()
    if record is None:
        abort(404)
    # send_from_directory uses safe_join and rejects traversal/absolute paths
    return send_from_directory(UPLOADS, record.stored_name, as_attachment=True)
```

The main points:
- **Look up by ID, scoped to the owner:** look the file up by an ID and filter on `owner_id`, rather than using the raw filename from the request. This fixes both the IDOR and the trust problem.
- **Use `send_from_directory`:** it uses `werkzeug.security.safe_join`, which rejects `..` and absolute paths. Use it even after the database lookup, as a second layer of protection.
- **Use server-generated stored names:** save uploads under names the server generates, such as UUIDs, not names the client supplies.

I only had this one file, so I couldn't check whether authentication is applied globally somewhere else, for example in a `before_request` hook or a reverse proxy. Even if it is, the path traversal and the missing ownership check are still exploitable by any logged-in user.