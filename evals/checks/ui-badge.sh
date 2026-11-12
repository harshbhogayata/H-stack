#!/usr/bin/env bash
set -e
J=$(ls components/StatusBadge.jsx components/StatusBadge.tsx 2>/dev/null | head -1); test -n "$J"
CSS=$(ls components/StatusBadge.css 2>/dev/null || true)
FILES="$J $CSS"
! grep -Eiq '#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(|\b(red|green|yellow|orange)\b *[;"}]' $FILES
grep -q 'var(--c-' $FILES
grep -Eiq "ok|warn|error" "$J"
grep -Eiq 'children|label|\{(text|status|label)\}|aria-label|role=' "$J"
