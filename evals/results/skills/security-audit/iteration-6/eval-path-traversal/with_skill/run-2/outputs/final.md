`files.py` has one confirmed vulnerability: anyone who can reach the `/download` route can read any file the app process can read. The comment on line 8 describes access controls that the code never enforces. I did a focused review rather than a full audit, so no report files were written. I didn't run the Flask app; I only checked how `os.path.join` handles the inputs, using Python on its own.

## Finding 1: Path traversal gives arbitrary file read (`files.py:9-10`) — High

- **Who can do it:** anyone who can send a request to `/download`.
- **Input:** the `file` query parameter, passed straight to `os.path.join(UPLOADS, name)` and then to `send_file`.
- **Intended control:** downloads should stay inside `/srv/app/uploads`.
- **Why it fails:** `os.path.join` keeps `..` segments, and an absolute path replaces the base directory entirely:
  ```
  '../../../etc/passwd' -> /srv/app/uploads/../../../etc/passwd
  '/etc/passwd'         -> /etc/passwd
  ```
  Example request: `GET /download?file=/etc/passwd`.
- **What it exposes:** any file the app process can read. That includes the app's own source, config and `.env` files, keys, and every user's uploads. If one of those files holds credentials that lead to code execution or full database access, this becomes Critical. Which secrets sit on the host is a deployment fact I can't see from the source.

## Finding 2: The promised authentication and ownership checks are missing (`files.py:6-10`)

The comment says "any logged-in user can download files they uploaded," but the handler does neither part of that:
- **No login check.** There's no `login_required`, session check, or `before_request` hook in the repo (this file is the whole repo).
- **No ownership check.** Even within the uploads folder, `?file=<someone-else's-file>` serves another user's upload. That's an IDOR (one user reading another user's data) whenever filenames can be guessed or enumerated.

**Needs validation:** a reverse proxy or gateway in front of this app might require login. Nothing in the repo shows one. Even if it exists, it wouldn't fix the ownership problem or Finding 1.

## Smallest effective fix

The fix needs to guarantee two things: the logged-in user owns the file, and the resolved path stays inside `UPLOADS`.

```python
from flask import abort, send_from_directory
from werkzeug.utils import secure_filename

@app.get("/download")
@login_required                      # whatever auth the app uses
def download():
    name = secure_filename(request.args.get("file", ""))
    if not name:
        abort(400)
    user_dir = os.path.join(UPLOADS, str(current_user.id))   # per-user storage
    return send_from_directory(user_dir, name)               # rejects traversal; 404s
```

The safest version looks files up by an ID stored in the database, checks that the requesting user owns the record, and serves the stored path. Then the client never supplies a filesystem path at all. `send_from_directory` (which uses `safe_join` under the hood) blocks traversal on its own, but it doesn't check ownership, so the auth and per-user check are still needed.

## Tests to add

`file=../../etc/passwd`, `file=/etc/passwd` and `file=..%2f..%2fetc%2fpasswd` should each return 404 or 400. An unauthenticated request should return 401 or a redirect to login. User B asking for user A's file should get 404.