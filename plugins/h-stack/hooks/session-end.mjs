#!/usr/bin/env node
// SessionEnd: flush pointer only, inside the shared 1.5 s budget (HS-045). FAILURE_MODE=open
import fs from 'node:fs';
import path from 'node:path';
import { runHook, projectDir } from '../lib/core.mjs';

await runHook('session-end', 'open', async (input) => {
  const proj = projectDir(input);
  try { fs.writeFileSync(path.join(proj, '.h-stack', 'last-session'), `${input.session_id || ''} ${input.reason || ''}\n`); } catch { /* no state dir */ }
  return null;
});
