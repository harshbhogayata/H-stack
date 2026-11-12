#!/usr/bin/env bash
set -e
node --test >/dev/null
node "$(dirname "$0")/hidden/cart-shared-default.js"
