import re

SHA_RE = re.compile(r"[0-9a-f]{7,40}")


def is_sha(value):
    return isinstance(value, str) and SHA_RE.fullmatch(value) is not None
