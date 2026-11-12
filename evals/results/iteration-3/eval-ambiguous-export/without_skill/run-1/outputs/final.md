I added `exportNotes(format)` to `src/notes.js`. It returns all your notes as a string, and all 3 new tests pass.

- **`exportNotes()` or `exportNotes('json')`** gives back the notes as formatted JSON.
- **`exportNotes('markdown')`** gives one section per note, with the title, creation date, tags (only if the note has any) and body. A `---` line separates notes.
- **Any other format** throws `Unsupported export format: …`.

The function doesn't write files or start downloads. The library is shared by your desktop and web apps, so each app decides how to save the result: the desktop app can write it to disk and the web app can offer it as a download.

"Export" could also mean other formats, like CSV, or a function that writes the file directly. I picked JSON and Markdown as a guess, so tell me if you meant something else.

The tests are in `test/notes.test.js`, the first tests in the repo. Nothing is committed yet.