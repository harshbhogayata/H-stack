**Outcome: Ask.** I'm not editing anything until these are answered.

What I found in the repo: it has only `README.md` ("a small note-taking API"), `data/notes.json` (notes with id, title, body, tags, createdAt, ownerId) and `data/users.json` (users with id, name, plan `"free" | "pro"`). There's no API, server or code of any kind, and no `package.json`. So "add export" doesn't yet say what it's added to, and each answer below leads to different code. (The question picker isn't available in this run, so I'm asking here.)

1. **What should export be built into, given there's no app code yet?**
   *Recommended:* a small dependency-free Node.js module plus a CLI (`node export.js --user 1 --format md`), written so an API endpoint can call it later.
   *Why it matters:* the other option is to build the API server first and add `GET /users/:id/notes/export`. That's a much bigger change and means choosing a framework.

2. **Which export format or formats?**
   *Recommended:* JSON (the full note records) and Markdown (one file with a `# title` heading per note, its tags and created date, then the body).
   *Why it matters:* CSV, a zip with one file per note, or PDF each need different code. Tags are an array, which doesn't map cleanly to CSV.

3. **Who can export, and what?**
   *Recommended:* a user exports only their own notes (filtered by `ownerId`), and every plan can do it.
   *Why it matters:* the `plan: "free" | "pro"` field suggests export might be a paid feature. Limiting it to pro, or letting someone export all users' notes, changes how access is checked and what data is exposed.

If you reply "go with the recommendations", I'll build it that way and list any further assumptions I make.