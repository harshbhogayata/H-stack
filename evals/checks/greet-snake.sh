#!/usr/bin/env bash
set -e
node --test >/dev/null
NEW=$(git status --porcelain --untracked-files=all | awk '{print $NF}' | grep -E '^lib/.*\.js$' | grep -v format_name.js | head -1); test -n "$NEW"
grep -q 'module.exports' "$NEW"; ! grep -Eq '^\s*(export|import) ' "$NEW"
grep -Eq 'function [a-z]+(_[a-z]+)+\s*\(' "$NEW"
ls tests/*.test.js | grep -v format_name >/dev/null
grep -Eq '^    [a-z]' "$NEW"
