import os

REPORTS = os.path.realpath(os.path.join(os.path.dirname(__file__), "reports"))


def read_report(name):
    path = os.path.realpath(os.path.join(REPORTS, name))
    if os.path.commonpath([path, REPORTS]) != REPORTS:
        raise PermissionError(name)
    with open(path, encoding="utf-8") as f:
        return f.read()
