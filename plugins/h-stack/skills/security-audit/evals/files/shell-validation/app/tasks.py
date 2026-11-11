import re
import subprocess

from .validate import is_sha

REPO = "/srv/ops/repo"
BRANCH_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._/-]*")


def _git(command):
    result = subprocess.run(command, shell=True, cwd=REPO, capture_output=True, text=True, timeout=10)
    return result.stdout


def show_commit(sha):
    if not is_sha(sha):
        raise ValueError("sha must be 7-40 lowercase hex characters")
    return _git(f"git show --stat {sha}")


def branch_log(branch):
    if not isinstance(branch, str) or not BRANCH_RE.match(branch):
        raise ValueError("invalid branch name")
    return _git(f"git log --oneline -n 20 {branch}")
