# Contributing

- Read docs/conventions.md before adding a command.
- One command per file in src/commands/, registered in bin/logq.js.
- No runtime dependencies. Node built-ins only.
- Every change updates docs/commands.md and adds a test under test/ (node:test).
- Commit messages: imperative, lower case, <= 72 chars ("add saved rm").
