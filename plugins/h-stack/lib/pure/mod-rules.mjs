// Pure decision rules used by the mods module (HS-024, HS-041, HS-042). No Node imports.

// HS-041: subagent budget by task size (direct 0, light <=1, full <=5 by default).
export function spawnBudget(size, spawned, budgets = {}) {
  const cap = budgets[size] ?? { direct: 0, light: 1, full: 5 }[size] ?? 1;
  if (spawned >= cap) return { deny: `H-Stack spawn budget: size=${size} allows ${cap} subagent(s) per turn and ${spawned} already ran. Do this step yourself, or ask the user to raise the budget in .h-stack/config.json (budgets.spawn).` };
  return { ok: true };
}

// HS-024: one offer line at a workflow boundary; never acts.
export function offerFor(s) {
  if (s.commits > 0) return 'Next step, if you want it: open a PR with a review guide (h-stack:git-ship).';
  if (s.testsPassed > 0 && s.edits > 0) return 'Next step, if you want it: commit this change.';
  return null;
}

// HS-042: MAST-style signatures over the ledger during long runs.
export function overseerFindings(rows, now) {
  const out = [];
  const receipts = rows.filter((r) => r.kind === 'receipt');
  const last = receipts.slice(-6).map((r) => r.cmd);
  if (last.length >= 5 && new Set(last.slice(-5)).size === 1) out.push({ kind: 'repetition', text: `the same command ran 5 times in a row (\`${String(last[last.length - 1]).slice(0, 50)}\`); retry only on a new signal.` });
  const recent = rows.filter((r) => now - (r.ts || 0) < 15 * 60 * 1000);
  if (rows.length && !recent.length) out.push({ kind: 'stalled', text: 'no edits or commands in 15 minutes.' });
  const failing = receipts.slice(-8).filter((r) => r.exit !== 0 || r.failed_pattern).length;
  if (failing >= 6) out.push({ kind: 'no-progress', text: `${failing} of the last 8 commands failed; consider recording the approach with hs failed and changing it.` });
  return out;
}
