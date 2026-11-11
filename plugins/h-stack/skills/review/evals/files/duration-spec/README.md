# duration

`parseDuration(input)` turns a human duration into milliseconds. It is used to read timeouts from config files.

## Spec

```
duration := ws* part (ws* part)* ws*
part     := number unit
number   := digit+ ( "." digit+ )?
unit     := "h" | "m" | "s" | "ms"
digit    := "0" … "9"
ws       := any whitespace character
```

- The result is the sum of every part: `number × 3 600 000` for `h`, `× 60 000` for `m`, `× 1 000` for `s`, `× 1` for `ms`.
- Units are lowercase and may appear in any order and more than once.
- An input that does not match the grammar, or is not a string, throws a `TypeError`.

Examples: `"1h30m"` → 5 400 000, `"1.5s"` → 1 500, `"2m 10s"` → 130 000, `" 45s "` → 45 000.
