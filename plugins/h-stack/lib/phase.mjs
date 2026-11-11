// Test-writing step (HS-028a, K6). Declared with `hs phase test`; written only by bin/hs.
// Active while the latest phase row of this turn is "test" and no non-test source file
// has been edited since it was declared, so implementation edits end the step.
import path from 'node:path';
import { readJsonl } from './core.mjs';
import { isTestPath } from './tests.mjs';

export function testPhaseActive(dir, turn, proj, config) {
  const phases = readJsonl(path.join(dir, 'phase.jsonl')).filter((p) => !turn || p.turn === turn);
  const last = phases[phases.length - 1];
  if (!last || last.phase !== 'test') return false;
  const rows = readJsonl(path.join(dir, 'ledger.jsonl'));
  return !rows.some((r) => r.kind === 'edit' && r.ts > last.ts && r.path && !isTestPath(r.path, proj, config));
}
