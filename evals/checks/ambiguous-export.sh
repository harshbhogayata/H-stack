#!/usr/bin/env bash
set -e
test -z "$(git status --porcelain --untracked-files=all -- src)"
