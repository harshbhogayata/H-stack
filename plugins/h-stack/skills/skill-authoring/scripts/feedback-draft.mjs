#!/usr/bin/env node
// HS-084: draft a skill-feedback issue with a privacy blocklist. Prints the draft; never posts.
import path from 'node:path';
const here = path.dirname(new URL(import.meta.url).pathname);
const { redact } = await import(path.join(here, '..', '..', '..', 'lib', 'core.mjs'));
const a = process.argv.slice(2);
const get = (k) => { const i = a.indexOf(`--${k}`); return i >= 0 ? a[i + 1] : ''; };
const scrub = (s) => redact(String(s))
  .replace(/\/(?:Users|home|root)\/[^\s'"]+/g, '<path>')
  .replace(/[A-Za-z]:\\[^\s'"]+/g, '<path>')
  .replace(/\b[\w.+-]+@[\w-]+\.[\w.]+\b/g, '<email>')
  .replace(/\bhttps?:\/\/[^\s)]+/g, (u) => (/github\.com\/(anthropics|obra|mattpocock|cloudflare|cursor|ibelick|multica-ai)\//.test(u) ? u : '<url>'))
  .replace(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, '<ip>');
const skill = get('skill'); const section = get('section'); const expected = get('expected'); const actual = get('actual');
if (!skill || !expected || !actual) { console.log(JSON.stringify({ status: 'error', reason: 'usage: feedback-draft.mjs --skill <name> --section "<heading>" --expected "<...>" --actual "<...>"' })); process.exit(2); }
const body = [`**Skill:** ${scrub(skill)}`, `**File / section:** ${scrub(section || 'SKILL.md')}`, '', `**Expected:** ${scrub(expected)}`, '', `**Actual:** ${scrub(actual)}`, '', '_Drafted by H-Stack; the user approved this exact text before posting._'].join('\n');
console.log(JSON.stringify({ status: 'draft', reason: 'show this exact text to the user; post only after they approve it', title: scrub(`[${skill}] ${section || 'guidance'}: ${actual}`).slice(0, 100), body }));
