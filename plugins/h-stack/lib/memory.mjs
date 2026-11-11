// Native auto-memory location and committed lessons helpers (HS-023, HS-048..050).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { readJson, matchesAny } from './core.mjs';
import { splitFrontmatter } from './yaml.mjs';

export function autoMemoryDir(proj) {
  for (const f of [path.join(proj, '.claude', 'settings.local.json'), path.join(proj, '.claude', 'settings.json'), path.join(os.homedir(), '.claude', 'settings.json')]) {
    const d = readJson(f, {})?.autoMemoryDirectory;
    if (d) return d.replace(/^~(?=\/)/, os.homedir());
  }
  const base = process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude');
  return path.join(base, 'projects', path.resolve(proj).replace(/[^A-Za-z0-9]/g, '-'), 'memory');
}

// Committed lessons: .claude/rules/lessons/*.md with paths: frontmatter and entries.
export function loadLessons(proj) {
  const dir = path.join(proj, '.claude', 'rules', 'lessons');
  const out = [];
  let files = [];
  try { files = fs.readdirSync(dir).filter((f) => f.endsWith('.md')).sort(); } catch { return out; }
  for (const f of files) {
    const text = fs.readFileSync(path.join(dir, f), 'utf8');
    const { data, body } = splitFrontmatter(text);
    const entries = body.split(/^### /m).slice(1).map((chunk) => {
      const [title, ...rest] = chunk.split('\n');
      const field = (name) => (rest.join('\n').match(new RegExp(`^- \\*\\*${name}:\\*\\*\\s*(.+)$`, 'mi')) || [])[1] || '';
      return { id: title.trim(), trigger: field('Trigger'), applies: field('Applies when'), not_applies: field("Doesn't apply when"), evidence: (rest.join('\n').match(/```[\s\S]*?```/) || [''])[0], provenance: field('Provenance'), date: field('Date') };
    });
    out.push({ file: `.claude/rules/lessons/${f}`, paths: (data && data.paths) || [], entries });
  }
  return out;
}

export function lessonsFor(proj, relPaths) {
  return loadLessons(proj).filter((l) => !l.paths.length || relPaths.some((p) => matchesAny(p, l.paths)));
}
