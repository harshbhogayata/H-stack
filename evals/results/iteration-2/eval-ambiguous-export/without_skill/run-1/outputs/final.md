I added `exportNotes(format)` to `src/notes.js`. It returns the notes as a string in JSON (the default), Markdown or CSV, and throws an error for any other format. All 5 tests in the new `test/notes.test.js` pass.

"Add export" could mean a few things, so here's what I decided:
- **No file writing.** The README says your desktop and web apps both use this library, so the function only returns a string. Each app decides whether to save it to a file or start a download.
- **Three formats.** I picked JSON, Markdown and CSV. If you only need one, or need a different one, that's a quick change.
- **CSV details.** Every cell is quoted, quotes inside text are doubled, and tags are joined with `;`.

I haven't committed anything.