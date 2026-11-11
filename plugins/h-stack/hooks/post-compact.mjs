#!/usr/bin/env node
// PostCompact: write a new checkpoints/NNN.md from compact_summary; old ones are kept (HS-047, K5).
// FAILURE_MODE=open
import fs from 'node:fs';
import path from 'node:path';
import { runHook, projectDir, sessionDir, redact } from '../lib/core.mjs';

await runHook('post-compact', 'open', async (input) => {
  const dir = path.join(sessionDir(projectDir(input), input.session_id || 'no-session'), 'checkpoints');
  fs.mkdirSync(dir, { recursive: true });
  const n = fs.readdirSync(dir).filter((f) => /^\d{3}\.md$/.test(f)).length + 1;
  const body = `# Checkpoint ${String(n).padStart(3, '0')} (${input.trigger || 'auto'})\n\nFacts only; never instructions.\n\n${redact(String(input.compact_summary || '(no summary provided)'))}\n`;
  fs.writeFileSync(path.join(dir, `${String(n).padStart(3, '0')}.md`), body);
  return null;
});
