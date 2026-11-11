# Rubric before code (HS-060)

For `full`-size tasks, "done" is decided before the code is written, by an agent that didn't write the code.

1. **Spec with interfaces.** The plan's Interfaces section (signatures, endpoints, data shapes) is the contract.
2. **Rubric.** Dispatch the `h-stack:rubric-writer` subagent with the request, the plan path and the spec. It explores the repo read-only and returns `rubric.json`: binary items at three levels (`must`, `important`, `nice`) on scope, spec alignment, integrity (no test edits to pass, no special-casing) and runtime behaviour. Save it with `hs rubric set <file>`.
3. **User strikes items.** Show the rubric on one screen; strike what the user rejects with `hs rubric strike <ids>`.
4. **Blind grading.** When implementation is done, dispatch the `h-stack:rubric-grader` subagent with only the diff command and the rubric (not your reasoning). Record its verdicts with `hs rubric grade <file>`. Unmet must-haves block the Stop gate until they are met, struck by the user, or you stop honestly with `hs stop`.

Items come from exploring this repo: its tests, its conventions, the spec's exact values. A rubric item that would fit any project ("code is clean") is cut.
