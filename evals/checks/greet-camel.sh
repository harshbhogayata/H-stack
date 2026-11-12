#!/usr/bin/env bash
set -e
node --test >/dev/null
NEW=$(git status --porcelain --untracked-files=all | awk '{print $NF}' | grep -E '^src/[A-Za-z]+\.js$' | grep -v -E 'formatName|\.test\.js' | head -1); test -n "$NEW"
grep -Eq '^export function [a-z]+[A-Z][A-Za-z]*\s*\(' "$NEW"
grep -q '/\*\*' "$NEW"; ! grep -q 'module.exports' "$NEW"
B=$(basename "$NEW" .js); test -f "src/$B.test.js"
