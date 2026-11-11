// Local-only telemetry (HS-058). One writer module; nothing leaves the machine.
import path from 'node:path';
import { appendLine, stateDir, sha } from './core.mjs';

export function logTool(proj, row) {
  try { appendLine(path.join(stateDir(proj), 'telemetry', 'tools.jsonl'), { ts: Date.now(), ...row }, proj); } catch { /* never break a hook */ }
}
export function logActivation(proj, row) {
  try {
    const r = { ts: Date.now(), ...row };
    if (r.prompt) { r.prompt_hash = sha(r.prompt, 12); delete r.prompt; }
    appendLine(path.join(stateDir(proj), 'telemetry', 'activation.jsonl'), r, proj);
  } catch { /* ignore */ }
}
export function logTurn(proj, row) {
  try { appendLine(path.join(stateDir(proj), 'telemetry', 'turns.jsonl'), { ts: Date.now(), ...row }, proj); } catch { /* ignore */ }
}
