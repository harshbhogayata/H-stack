# Conventions

Audience: developers and SREs at a terminal, often piping output into other tools.

## Output
- stdout is data, stderr is diagnostics. Never print progress to stdout.
- Every command that prints data supports `--json` (one JSON object per line).
- Human output: plain text, no colour unless stdout is a TTY and `NO_COLOR` is unset. No emoji, no spinners.

## Errors
- Format: `logq: <what failed>: <why>` on stderr, then exit 2 for usage errors, 3 for I/O errors.
- Suggest the fix in one line when there is one (`try: logq saved ls`).

## Config and data
- Config lives at `$XDG_CONFIG_HOME/logq/config.json` (default `~/.config/logq/config.json`), read and written only through `src/config.js`.
- Saved queries and history live at `$XDG_DATA_HOME/logq/` (default `~/.local/share/logq/`).
- Flags override env (`LOGQ_*`), env overrides the config file.
- Never prompt when stdin is not a TTY; fail with a clear message instead.

## Docs tone
Terse and technical. Lead with the command, then one sentence. No marketing words ("powerful", "blazing", "simply").
