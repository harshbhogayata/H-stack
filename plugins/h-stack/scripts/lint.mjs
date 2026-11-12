#!/usr/bin/env node
// HS-013 skill and import linter (complements `claude plugin validate .`).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { splitFrontmatter } from '../lib/yaml.mjs';
import { isMain } from '../lib/core.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const EVENTS = new Set(['test_failed', 'build_failed', 'path_edit', 'pre_push']);
const SIZES = new Set(['direct', 'light', 'full']);
const CAPS = /\b(YOU MUST|MUST NOT|MUST|NEVER|ALWAYS|DO NOT)\b|\b(CRITICAL|IMPORTANT|REQUIRED)\s*[:!]/;
const HOUSE_STYLE = /(#[0-9a-fA-F]{6}\b.*#[0-9a-fA-F]{6}\b|\bfont-family:\s*['"]?(Inter|Roboto|Space Grotesk)|use (exactly|only) (this|these) (palette|colors|fonts))/;

export function lintSkill(dir, thirdParty) {
  const errs = [];
  const name = path.basename(dir);
  const file = path.join(dir, 'SKILL.md');
  if (!fs.existsSync(file)) return [`${name}: SKILL.md missing`];
  const text = fs.readFileSync(file, 'utf8');
  const { data, body } = splitFrontmatter(text);
  if (!data) return [`${name}: frontmatter missing`];
  if (data.name !== name) errs.push(`${name}: name "${data.name}" does not match folder`);
  if (data['user-invocable'] !== false) errs.push(`${name}: user-invocable must be false (no slash commands)`);
  if ('disable-model-invocation' in data) errs.push(`${name}: disable-model-invocation is not used (OD-8)`);
  const desc = String(data.description || '');
  const wtu = String(data.when_to_use || '');
  if (!desc) errs.push(`${name}: description missing`);
  if (desc.length + wtu.length > 1536) errs.push(`${name}: description + when_to_use is ${desc.length + wtu.length} chars (cap 1536)`);
  if (/^(use (this|when)|trigger|when the user)/i.test(desc)) errs.push(`${name}: description must lead with the use case, not trigger phrasing`);
  const lines = text.split('\n').length;
  if (lines > 500) errs.push(`${name}: SKILL.md has ${lines} lines (max 500)`);
  const h = data.metadata?.hstack;
  if (!h) errs.push(`${name}: metadata.hstack missing`);
  else {
    if (!/^(0[1-9]|1[0-6])$/.test(String(h.category).padStart(2, '0'))) errs.push(`${name}: metadata.hstack.category must be 01-16`);
    if (!Array.isArray(h.intents)) errs.push(`${name}: metadata.hstack.intents must be a list`);
    for (const k of h.keywords || []) { try { new RegExp(k, 'i'); } catch { errs.push(`${name}: keyword ${k} does not compile`); } }
    for (const e of h.events || []) if (!EVENTS.has(e)) errs.push(`${name}: unknown event ${e}`);
    for (const s of h.sizes || []) if (!SIZES.has(s)) errs.push(`${name}: unknown size ${s}`);
    if (h.explicit_only && !(h.explicit_phrases || []).length) errs.push(`${name}: explicit_only needs explicit_phrases`);
    if ('paths' in h) errs.push(`${name}: do not reuse native frontmatter names (paths) inside metadata.hstack`);
    if (!h.short || h.short.length > 60) errs.push(`${name}: metadata.hstack.short (<=60 chars) is required for the router map`);
  }
  const evalPath = path.join(dir, h?.eval || 'evals/evals.json');
  if (!fs.existsSync(evalPath)) errs.push(`${name}: ${path.relative(dir, evalPath)} missing`);
  else {
    try {
      const ev = JSON.parse(fs.readFileSync(evalPath, 'utf8'));
      if (!Array.isArray(ev.evals) || ev.evals.length < 3) errs.push(`${name}: evals.json needs >= 3 evals`);
      for (const e of ev.evals || []) if (!e.prompt || !Array.isArray(e.expectations) || !e.expectations.length) errs.push(`${name}: eval ${e.id} needs prompt and expectations`);
    } catch (e) { errs.push(`${name}: evals.json is not valid JSON (${e.message})`); }
  }
  const imported = (h?.source || []).length > 0;
  if (imported) {
    if (!fs.existsSync(path.join(dir, 'LICENSE'))) errs.push(`${name}: imported skill without LICENSE`);
    if (!thirdParty.some((r) => r.skill === name)) errs.push(`${name}: imported skill without a THIRD_PARTY row`);
  }
  // Referenced files exist.
  for (const m of body.matchAll(/\]\((?!https?:|#|mailto:)([^)\s]+)\)/g)) {
    const p = m[1].split('#')[0];
    if (p && !fs.existsSync(path.join(dir, p))) errs.push(`${name}: referenced file ${p} does not exist`);
  }
  for (const m of body.matchAll(/`((?:references|scripts)\/[\w./-]+)`/g)) if (!fs.existsSync(path.join(dir, m[1]))) errs.push(`${name}: referenced file ${m[1]} does not exist`);
  // All-caps imperatives (A4) outside code blocks; house styles.
  const prose = body.replace(/```[\s\S]*?```/g, '').replace(/`[^`]*`/g, '');
  const capLine = prose.split('\n').find((l) => CAPS.test(l));
  if (capLine) errs.push(`${name}: all-caps imperative: "${capLine.trim().slice(0, 80)}"`);
  if (HOUSE_STYLE.test(prose)) errs.push(`${name}: looks like a house style (fixed palette or font)`);
  // Long fenced code in references/ must be marked tested.
  const refDir = path.join(dir, 'references');
  if (fs.existsSync(refDir)) for (const f of fs.readdirSync(refDir)) {
    const t = fs.readFileSync(path.join(refDir, f), 'utf8');
    for (const block of t.matchAll(/```[\w-]*\n([\s\S]*?)```/g)) if (block[1].split('\n').length > 40 && !/<!--\s*tested:/.test(t)) errs.push(`${name}: references/${f} has a fenced block over 40 lines without a <!-- tested: ... --> note`);
    const capRef = t.replace(/```[\s\S]*?```/g, '').split('\n').find((l) => CAPS.test(l.replace(/`[^`]*`/g, '')));
    if (capRef) errs.push(`${name}: references/${f} all-caps imperative: "${capRef.trim().slice(0, 80)}"`);
  }
  return errs;
}

export function lintAgent(file) {
  const errs = [];
  const { data, body } = splitFrontmatter(fs.readFileSync(file, 'utf8'));
  const n = path.basename(file);
  if (!data?.name || !data?.description) errs.push(`agents/${n}: name and description required`);
  if (data?.tools && /\b(Edit|Write|MultiEdit)\b/.test(String(data.tools)) && /review|audit|rubric|intent|grader/.test(n)) errs.push(`agents/${n}: read-only agent lists write tools`);
  if (CAPS.test(String(body).replace(/```[\s\S]*?```/g, '').replace(/`[^`]*`/g, ''))) errs.push(`agents/${n}: all-caps imperative`);
  return errs;
}

if (isMain(import.meta.url)) {
  const tp = JSON.parse(fs.existsSync(path.join(ROOT, 'third-party.json')) ? fs.readFileSync(path.join(ROOT, 'third-party.json'), 'utf8') : '{"imports":[]}').imports;
  const errs = [];
  const sk = path.join(ROOT, 'skills');
  let n = 0;
  for (const d of fs.existsSync(sk) ? fs.readdirSync(sk).sort() : []) { if (!fs.statSync(path.join(sk, d)).isDirectory()) continue; n++; errs.push(...lintSkill(path.join(sk, d), tp)); }
  const ag = path.join(ROOT, 'agents');
  let a = 0;
  for (const f of fs.existsSync(ag) ? fs.readdirSync(ag).filter((x) => x.endsWith('.md')).sort() : []) { a++; errs.push(...lintAgent(path.join(ag, f))); }
  console.log(JSON.stringify({ status: errs.length ? 'fail' : 'ok', reason: `${n} skills, ${a} agents linted; ${errs.length} problem(s)` }));
  for (const e of errs.slice(0, 10)) console.log(e);
  process.exit(errs.length ? 1 : 0);
}
