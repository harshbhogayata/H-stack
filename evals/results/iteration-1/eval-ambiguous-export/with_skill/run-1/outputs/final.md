I added `exportNotes(format)` to `src/notes.js`. It returns the notes as a string: JSON by default, or Markdown if you pass `'markdown'`. Any other format throws an error. I also added `test/notes.test.js` with three tests: the JSON output parses back to the same notes, the Markdown includes titles, bodies and tags (tags only when a note has some), and an unknown format is rejected. All three pass.

"Export" was open to interpretation, so I made these choices:
- **It returns a string instead of saving a file.** The README says the desktop app and the web app both use this library. A file-writing function wouldn't work in the browser, so each app decides where the output goes.
- **JSON and Markdown only.** JSON covers backups and moving notes between apps; Markdown is for reading.

If you want something different, such as CSV, writing straight to a file, or exporting only some notes, tell me and I'll change it. Nothing is committed yet.