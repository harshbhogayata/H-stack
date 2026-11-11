# task.yaml: declared effects for unattended jobs (HS-044)

A scheduled job's prompt can widen what it does; a declaration can't. Each Routine or Workflow H-Stack sets up gets one file:

```yaml
name: nightly-dependency-audit
trigger: "cron 17 2 * * *"
reads: [Read, Grep, Glob, "Bash(npm outdated:*)", "Bash(npm audit:*)"]
effects:
  - edit: "reports/deps/**"        # files it may write
  - bash: "git add reports/deps"   # command prefixes it may run that change things
  - bash: "git commit -m"
  - push: "audit-reports"          # branch it may push to (never the default branch)
budgets: {max_turns: 40}
```

Flow: a plan run emits JSON of intended actions; `node ${CLAUDE_PLUGIN_ROOT}/scripts/effects.mjs validate task.yaml plan.json` checks each against `effects`; then `hs manifest start task.yaml` arms the gate for the apply step and `hs manifest stop` disarms it. While armed, the Bash gate denies irreversible actions and writes that the manifest doesn't declare. Nothing outside the declaration is possible.
