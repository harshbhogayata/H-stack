// Reads the generated skill index (HS-015).
import path from 'node:path';
import { PLUGIN_ROOT, readJson } from './core.mjs';

let cached = null;
export function loadIndex() {
  if (!cached) cached = readJson(path.join(PLUGIN_ROOT, 'index.json'), { skills: [], events: {}, paths: [] });
  return cached;
}
