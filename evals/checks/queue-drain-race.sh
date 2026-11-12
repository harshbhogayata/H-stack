#!/usr/bin/env bash
set -e
for i in 1 2 3 4 5 6 7 8; do node --test >/dev/null 2>&1; done
node "$(dirname "$0")/hidden/queue-drain-race.js"
