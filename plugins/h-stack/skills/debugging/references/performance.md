# Performance work

Ideas from research/06 (pstack benchmark-checklist, addyosmani performance-optimization; both MIT), written for H-Stack.

1. **Baseline first.** Measure the current number with the project's own benchmark, profiler or timing harness before changing anything. No baseline, no claim.
2. **Find the bottleneck by measurement**: profile or time each stage; don't optimise what you guessed.
3. **One change per measured attempt.** Re-measure after each change; keep it if the number improved beyond noise, revert it if not. One commit per accepted win.
4. **Keep the evaluator fixed.** The benchmark, its inputs and its budget don't change during the work, so the metric can't be gamed.
5. **Before reporting a number:** same machine and inputs for before and after; several runs with the spread reported; warm-up excluded or stated; the build mode (debug/release) named; correctness tests still pass.
6. **Guard the win** with a budget or regression check where the project has a place for one.
