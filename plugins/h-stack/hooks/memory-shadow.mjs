#!/usr/bin/env node
// PostToolUse(Edit|Write|MultiEdit) on files under the native auto-memory directory: append a
// before/after diff to .h-stack/memory-shadow.jsonl and flag merges that drop specifics (HS-050).
// Single writer of memory-shadow.jsonl and cache/memory/. FAILURE_MODE=open
import fs from 'node:fs';
import path from 'node:path';
import { runHook, projectDir, stateDir, appendLine, sha, context } from '../lib/core.mjs';
import { autoMemoryDir } from '../lib/memory.mjs';

const SPECIFIC = /(`[^`]+`|\/[\w./-]+\.\w+|\b\d+(\.\d+)*\b|--[\w-]+|"[^"]{4,}")/g;

await runHook('memory-shadow', 'open', async (input) => {
  const proj = projectDir(input);
  const p = input.tool_input?.file_path;
  if (!p) return null;
  const memDir = path.resolve(autoMemoryDir(proj));
  const abs = path.resolve(p);
  if (!abs.startsWith(memDir + path.sep)) return null;
  const cacheDir = path.join(stateDir(proj), 'cache', 'memory');
  fs.mkdirSync(cacheDir, { recursive: true });
  const cacheFile = path.join(cacheDir, sha(abs, 16));
  let before = '';
  try { before = fs.readFileSync(cacheFile, 'utf8'); } catch { /* first sight */ }
  let after = '';
  try { after = fs.readFileSync(abs, 'utf8'); } catch { /* deleted */ }
  fs.writeFileSync(cacheFile, after);
  if (before === after) return null;
  const bl = new Set(before.split('\n')); const al = new Set(after.split('\n'));
  const removed = [...bl].filter((l) => l.trim() && !al.has(l));
  const added = [...al].filter((l) => l.trim() && !bl.has(l));
  const specificsBefore = new Set((removed.join('\n').match(SPECIFIC) || []));
  const afterText = after;
  const dropped = [...specificsBefore].filter((s) => !afterText.includes(s)).slice(0, 10);
  appendLine(path.join(stateDir(proj), 'memory-shadow.jsonl'), {
    path: abs, before_sha: sha(before, 16), after_sha: sha(after, 16), ts: Date.now(),
    diff: [...removed.map((l) => `- ${l}`), ...added.map((l) => `+ ${l}`)].join('\n').slice(0, 2500), dropped_specifics: dropped,
  }, proj);
  if (before && dropped.length) return context('PostToolUse', `H-Stack: this auto-memory rewrite dropped specifics (${dropped.slice(0, 4).join(', ')}). The previous text is in .h-stack/memory-shadow.jsonl if they should be restored.`);
  return null;
});
