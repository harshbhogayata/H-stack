---
description: A failing test with a stack trace should route to h-stack:debugging.
max_turns: 8
allowed_tools: [Read, Glob, Grep, Skill]
tags: [activation]
---
My pytest run fails with `TypeError: unsupported operand type(s) for +: 'int' and 'str'` at totals.py line 12, right after I changed the CSV parser. The code isn't in this folder; tell me how you would track this down before changing anything.
