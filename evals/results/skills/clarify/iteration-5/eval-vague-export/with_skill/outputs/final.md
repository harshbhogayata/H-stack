**Outcome: Ask.** I'm not making changes yet. Some answers would change what I build, and one of them is a gap in the repo itself.

**What's in the repo:** a README describing "a small note-taking API", plus `data/notes.json` (one note: id, title, body, tags, createdAt, ownerId) and `data/users.json` (one user on the `free` plan). There is no API code at all: no server, routes or `package.json`, and nothing in git history beyond the fixture commit. So there's nothing to attach "export" to yet.

**Questions (3):**

1. **Where should export live, given there's no API code here?**
   - **Recommended:** I add a minimal Node API with no dependencies, using `node:http` to read `data/*.json`, and put the export endpoint on it (`GET /users/:id/export`).
   - Alternatives: the API code lives in another repo or branch (point me to it), or you want a standalone CLI script (`node export.js --user 1`) instead of an endpoint.
   - *Why it matters:* this decides whether I'm adding a feature or building the app's skeleton first.

2. **Which export format?**
   - **Recommended:** JSON (lossless, so it can be re-imported) plus Markdown (one readable section per note, with title, tags and date in front matter), chosen with `?format=json|md`.
   - Alternatives: JSON only, or CSV (tags would need flattening).
   - *Why it matters:* it sets the output shape and how tags and dates are serialized.

3. **Who can export what?**
   - **Recommended:** every user can export only their own notes (filtered by `ownerId`), on any plan.
   - Alternative: export is a `pro`-only feature. The README calls out `free` / `pro` plans, which suggests gating might be intended, and the only user so far is `free`.
   - *Why it matters:* gating adds a 403 path, and the scoping rule is a privacy boundary.

**Assumed unless you say otherwise:**
- Export covers all of a user's notes at once, with no per-note export and no tag or date filters in this pass.
- The response downloads as a file (`Content-Disposition: attachment; filename=notes-<userId>.<ext>`).
- An unknown user returns 404, and a user with no notes gets an empty export rather than an error.
- I'll add a small test against the fixture data.

Reply with "go with recommendations" or with changes, and I'll build it.