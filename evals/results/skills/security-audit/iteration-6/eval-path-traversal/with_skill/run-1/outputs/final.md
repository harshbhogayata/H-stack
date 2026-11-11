I reviewed `files.py` with the security-audit skill as a focused review, not a full audit, so I wrote no report files. I didn't run the code; everything below comes from reading the source. The file is 10 lines and has one serious vulnerability, plus an access-control gap that would remain even after it's fixed.

## Finding 1 — Path traversal lets anyone read any file the app can read (high)

**Where:** `files.py:9-10`

```python
name = request.args.get("file", "")
return send_file(os.path.join(UPLOADS, name))
```

- **Who can exploit it:** anyone who can send HTTP requests to the app. There is no login check (see Finding 2).
- **Input:** the `file` query parameter, which goes straight into the path with no checks.
- **Intended control:** downloads should be limited to `/srv/app/uploads`.
- **How it's bypassed:** in two ways.
  - `?file=../../../etc/passwd`: `os.path.join` doesn't resolve `..`, so the path escapes the uploads folder.
  - `?file=/etc/passwd`: when the second argument is an absolute path, `os.path.join` throws away `UPLOADS` entirely. This works even without `..`.
- **Result:** an attacker can read any file the server process can read. That includes the app's source code, config files, `.env` or credential files, and every user's uploads.
- **Severity:** I rated it high: an unauthenticated read of the app's files and secrets. It becomes critical if a readable file holds credentials that give database access or code execution (for example `SECRET_KEY` for Flask session forging, or database passwords). That depends on how the server is deployed, which isn't in the repo.

## Finding 2 — No login check and no check that the file belongs to the user (high)

**Where:** `files.py:6-10`

The comment says "Any logged-in user can download files *they uploaded*", but the code enforces neither part:
- The route has no login check (no `@login_required` or session check), so anonymous users can call it.
- Nothing links `name` to whoever is making the request. Even if the path stayed inside `UPLOADS`, any caller could download any other user's upload by guessing or enumerating file names.

The comment states the intended rule, so this is a real authorization failure, not missing hardening.

## Smallest effective fix

Do the checks at the last decision point, just before `send_file`:

```python
from flask import abort, send_from_directory
from flask_login import login_required, current_user  # or your auth mechanism

@app.get("/download")
@login_required
def download():
    name = request.args.get("file", "")
    # Ownership: look up the file in the DB, scoped to the current user,
    # and serve the stored name, not the raw user input.
    rec = Upload.query.filter_by(owner_id=current_user.id, public_name=name).first_or_404()
    return send_from_directory(UPLOADS, rec.stored_name)  # safe_join: rejects ../ and absolute paths
```

- `send_from_directory` uses `werkzeug.security.safe_join`, which rejects `..`, absolute paths and other path tricks. That fixes Finding 1 on its own.
- Looking the file up by owner fixes Finding 2. Storing uploads under server-generated names (such as UUIDs) also means user-supplied names never touch the filesystem.

**Tests to add:** `?file=../x` and `?file=/etc/passwd` should return 404. An anonymous request should get 401 or a redirect. User A requesting user B's file should get 404.

## Can't confirm from the repo

A reverse proxy might normalise `../` before requests reach the app, but it can't block the absolute-path version (`?file=/etc/passwd`). It also wouldn't add the missing login or ownership checks. I haven't checked which files the server process can actually read in deployment, and that determines whether Finding 1 is high or critical.