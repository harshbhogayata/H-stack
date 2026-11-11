# Commands

## logq run [--json] [--limit N] <query> <file...>
Print log lines matching `<query>`. Reads stdin when no file is given.

## logq saved add <name> <query>
Store a query under `<name>` in the data dir.

## logq saved ls [--json]
List saved queries.

## logq saved run <name> <file...>
Run a saved query.
