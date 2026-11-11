Work in progress: migrating config loading from config.ini to config.toml.
Done: parser in src/config.py. Tried tomllib on Python 3.10: failed (tomllib is 3.11+), switched to tomli.
Open: update docs/setup.md; remove config.ini fallback after release 2.4.
User correction earlier: "keep the env var override, ops relies on it".
