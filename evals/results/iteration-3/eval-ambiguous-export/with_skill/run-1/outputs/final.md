I added `exportNotes(format)` to `src/notes.js`. It returns your notes as text in one of two formats:

- **`'json'`** (the default): pretty-printed JSON with every field (id, title, body, tags, created date).
- **`'markdown'`**: one section per note with the title as a heading, then the created date, the body, and a "Tags:" line if the note has tags.

Any other format throws an error. All 3 new tests in `test/notes.test.js` pass; I watched them fail before adding the function.

Some decisions you may want to change:

- **It doesn't save a file.** The README says this library is used by both your desktop and web apps, so the function only returns the text. Each app decides whether to save it to disk or offer it as a download.
- **I picked the formats.** "Add export" didn't name any, so I chose JSON and Markdown. If you need something else, like CSV, or exporting only some notes (for example by tag), tell me and I'll add it.

I haven't committed anything.