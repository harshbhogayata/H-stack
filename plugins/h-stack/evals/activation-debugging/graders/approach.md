---
type: llm
---
PASS if the reply puts reproducing the failure and finding where the string value comes from (for example the parser change) before proposing a fix.
FAIL if the reply's first move is a code change such as wrapping the value in int() without first establishing where the bad value originates.
