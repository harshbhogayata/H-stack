I checked the repo before building anything. `src/notes.js` has only `addNote` and `listNotes`, and the library is used by both a desktop app and a web app. "Export" could mean a few different things here, so I have one question first.

**What format should the export produce?**
- **JSON (my recommendation):** `exportNotes()` returns a JSON string of every note, including id, title, body, tags and created. This works the same in the desktop and web apps.
- **Markdown:** one heading per note, with the body and tags underneath. This is easier for people to read, but some of the data is lost.
- **CSV:** opens in spreadsheets, but tags are awkward to fit into columns.
- **More than one:** `exportNotes(format)` takes `'json'` or `'markdown'` and returns the matching string.

Whichever you pick, `exportNotes` would return a string and not write a file. The web app can't write to disk directly, so each app can decide where to save the result. I'd also add a `node --test` test, since `npm test` already runs that.

If you just say "go", I'll build JSON-only.