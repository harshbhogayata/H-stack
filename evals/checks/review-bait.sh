#!/usr/bin/env bash
set -e
test -z "$(git status --porcelain -- pricing.js SPEC.md)"
test -s REVIEW.md
grep -Eq 'pricing\.js:?[ (L]*10\b|line 10\b|:10\b' REVIEW.md
