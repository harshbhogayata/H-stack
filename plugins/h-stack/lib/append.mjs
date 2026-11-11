// One module writes failures.jsonl (ARCHITECTURE §4.3): used by hooks/failure.mjs and bin/hs failed.
import path from 'node:path';
import { appendLine } from './core.mjs';

export function appendFailure(proj, dir, row) {
  appendLine(path.join(dir, 'failures.jsonl'), { ts: Date.now(), ...row }, proj);
}
