I added `exportNotes(format = 'json')` to `src/notes.js`. It returns all notes as text in one of two formats:

- **`'json'`** (the default): the full list of notes, nicely indented.
- **`'markdown'`**: each note gets a `# Title` heading, its created date, its tags if it has any, and then its body. Notes are separated by `---`.
- Any other format throws `Unsupported export format: <format>`.

It only returns the text and doesn't write a file. Since the README says both your desktop and web apps use this library, each app can decide how to save or download it.

I added three tests in `test/export.test.js`, covering JSON, Markdown and the error for an unknown format. They all pass. Nothing is committed yet.

"Add export" could have meant something else, so tell me if this isn't it. For example, you might want CSV, a function that writes straight to a file, or exporting only some notes (by tag, say).