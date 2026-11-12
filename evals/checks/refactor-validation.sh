#!/usr/bin/env bash
set -e
node --test >/dev/null
node "$(dirname "$0")/hidden/refactor-validation.js"
n=$(grep -o '\[a-z\]{2,}' handlers.js | wc -l); [ "$n" -le 1 ] || { echo "email regex still duplicated ($n copies)"; exit 1; }
