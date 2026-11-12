# CLI conventions
- Data goes to stdout; diagnostics and errors go to stderr.
- Errors print `stats: <what failed>: <why>` and exit with code 2. Nothing is written to stdout on error, with or without --json.
- `--json` prints exactly one JSON object on stdout with the same fields the text output shows, numbers as numbers.
- Flags may appear before or after the file argument.
