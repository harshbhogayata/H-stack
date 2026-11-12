#!/usr/bin/env bash
set -e
node --test >/dev/null
node "$(dirname "$0")/hidden/rate-limit-spec.js"
