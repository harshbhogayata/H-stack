I can't add export yet because the repo has no app code to add it to. It contains only `README.md`, which describes it as "a small note-taking API", plus two data files, `data/notes.json` and `data/users.json`. There's no server, routes, language or framework.

So before I write anything, I need a few decisions from you:

1. **Interface:** Should this be an HTTP endpoint (e.g. `GET /notes/export`) or a command-line script? If it's an API, I'd also be choosing the stack (Node/Express, Python/FastAPI, etc.). Is there a preference, or does the real API live in another repo?
2. **Format:** JSON, Markdown (one file or a zip with one `.md` per note), CSV, or more than one?
3. **Scope:** Should it export one user's notes (by `ownerId`) or all notes? Should it support filters such as a tag or date range?
4. **Plan gating:** `users.json` has a `plan` field (`free` / `pro`). Should export be limited to pro users?

If you'd like me to just pick, I'd build a small Node script plus an HTTP endpoint: `GET /users/:id/notes/export?format=json|md|csv`. It would export only that user's notes, be open to every plan, and come with tests.