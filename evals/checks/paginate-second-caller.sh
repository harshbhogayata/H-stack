#!/usr/bin/env bash
set -e
node --test >/dev/null
node "$(dirname "$0")/hidden/paginate-second-caller.js"
