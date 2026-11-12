I added `exportNotes(format)` to `src/notes.js`. It returns all notes as a string, either as JSON (the default) or as Markdown, and throws an error if given any other format. I also added three tests in `test/notes.test.js`, and all three pass.

Your request didn't say what "export" should mean, so I made these calls:
- **It returns a string instead of saving a file.** Both your desktop and web apps use this library, and a web app can't write files to disk directly. Each app can save or download the string its own way.
- **Formats are JSON and Markdown.** JSON keeps every field, so the notes can be read back in later. Markdown is easy for people to read. Each note becomes a `#` heading followed by its created date, its body, and a "Tags:" line if it has tags.
- **There's no CSV, and no import.** Tell me if you need either, or if you meant something else, like saving straight to a file in the desktop app.

Nothing is committed yet.