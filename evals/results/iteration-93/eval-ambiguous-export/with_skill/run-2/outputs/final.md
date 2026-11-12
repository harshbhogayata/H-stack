I added `exportNotes(format)` to `src/notes.js`. It returns all notes as a string, either JSON (the default) or Markdown, and gives a clear error for any other format. It doesn't write files or start downloads, because the library is shared by your desktop app and your web app and each saves files differently. Each app takes the string and saves it its own way.

There are 3 new tests in `test/notes.test.js` covering the JSON output, the Markdown output and the error for an unknown format. All 3 pass under `npm test`.

Your request didn't specify a format, so JSON and Markdown were my guess. If you meant CSV, exporting a single note, or a built-in save to disk, tell me and I'll change it. Nothing is committed yet.