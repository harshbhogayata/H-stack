#!/usr/bin/env node
// HS-015: generate plugins/h-stack/index.json from SKILL.md frontmatter.
// Byte-stable: sorted by name, keys sorted, no timestamps. --check fails on any diff.
import fs from 'node:fs';
import path from 'node:path';
import { splitFrontmatter } from '../lib/yaml.mjs';
import { stable } from '../lib/core.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

export function buildIndex(root = ROOT) {
  const dir = path.join(root, 'skills');
  const skills = [];
  for (const name of fs.existsSync(dir) ? fs.readdirSync(dir).sort() : []) {
    const file = path.join(dir, name, 'SKILL.md');
    if (!fs.existsSync(file)) continue;
    const { data } = splitFrontmatter(fs.readFileSync(file, 'utf8'));
    if (!data) throw new Error(`${file}: no frontmatter`);
    const h = data.metadata?.hstack || {};
    for (const k of h.keywords || []) new RegExp(k, 'i'); // compile check
    skills.push({
      name: data.name,
      qualified: `h-stack:${data.name}`,
      category: h.category ?? null,
      purpose: data.description,
      short: h.short || String(data.description || '').split(/[.;]/)[0].slice(0, 60),
      hidden: Boolean(h.hidden),
      paths: data.paths || [],
      intents: h.intents || [],
      keywords: h.keywords || [],
      not_for: h.not_for || [],
      events: h.events || [],
      sizes: h.sizes || ['light', 'full'],
      modes: h.modes || { default: 'guidance', full_on: [] },
      explicit_only: Boolean(h.explicit_only),
      explicit_phrases: h.explicit_phrases || [],
      eval: h.eval || 'evals/evals.json',
      context: data.context || 'inline',
    });
  }
  skills.sort((a, b) => a.name.localeCompare(b.name));
  const events = {};
  for (const s of skills) for (const e of s.events) (events[e] ||= []).push(s.qualified);
  const paths = [];
  for (const s of skills) for (const g of s.paths) paths.push({ glob: g, skill: s.qualified });
  paths.sort((a, b) => (a.glob + a.skill).localeCompare(b.glob + b.skill));
  return stable({ version: 1, skills, events, paths });
}

export function serialise(idx) {
  return JSON.stringify(idx, null, 2) + '\n';
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const out = serialise(buildIndex());
  const target = path.join(ROOT, 'index.json');
  if (process.argv.includes('--check')) {
    const cur = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : '';
    if (cur !== out) { console.log(JSON.stringify({ status: 'fail', reason: 'index.json is stale; run node plugins/h-stack/scripts/gen-index.mjs' })); process.exit(1); }
    console.log(JSON.stringify({ status: 'ok', reason: `index.json current (${JSON.parse(out).skills.length} skills)` }));
  } else {
    fs.writeFileSync(target, out);
    console.log(JSON.stringify({ status: 'ok', reason: `wrote index.json (${JSON.parse(out).skills.length} skills)` }));
  }
}
