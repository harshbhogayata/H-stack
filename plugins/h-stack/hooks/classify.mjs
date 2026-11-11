#!/usr/bin/env node
// UserPromptSubmit (HS-018, HS-016, HS-034 paste warning, HS-021 why-that, HS-058 activation telemetry).
// FAILURE_MODE=open
import fs from 'node:fs';
import path from 'node:path';
import { runHook, projectDir, stateDir, sessionDir, readJson, writeJsonAtomic, context, looksLikeSecret, treeHash, sha, appendLine, redact } from '../lib/core.mjs';
import { effortFor, taskClass } from '../lib/retro.mjs';
import { loadIndex } from '../lib/index.mjs';
import { classify } from '../lib/pure/classify-rules.mjs';
import { logActivation } from '../lib/telemetry.mjs';
import { retrieveLessons } from '../lib/retrieve.mjs';

const SECRET_KINDS = [[/sk-ant-/, 'Anthropic API key'], [/\bgh[pousr]_|github_pat_/, 'GitHub token'], [/\bAKIA[0-9A-Z]{16}/, 'AWS access key'], [/xox[abprs]-/, 'Slack token'], [/-----BEGIN [A-Z ]*PRIVATE KEY/, 'private key'], [/\bsk-[A-Za-z0-9]{20,}/, 'API key'], [/\bAIza/, 'Google API key']];
const CORRECTION = /^\s*(no[,.! ]|nope|wrong|not that|that'?s not|don'?t use|stop using|why (did|are) you)/i;

// Values in the user's own prompt are trusted (T1); taint ignores them (HS-032).
function trustedValues(text) {
  const vals = new Set();
  for (const m of String(text).matchAll(/https?:\/\/[^\s'"<>)]+/g)) { vals.add(sha(m[0], 16)); try { vals.add(sha(new URL(m[0]).host, 16)); } catch { /* */ } }
  for (const m of String(text).matchAll(/[\w.+-]+@[\w-]+\.[\w.]+/g)) vals.add(sha(m[0], 16));
  for (const m of String(text).matchAll(/#?(\d{1,7})\b/g)) vals.add(sha(`num:${m[1]}`, 16));
  return [...vals];
}

await runHook('classify', 'open', async (input) => {
  const proj = projectDir(input);
  const sid = input.session_id || 'no-session';
  const prompt = String(input.prompt || '');
  stateDir(proj);
  fs.writeFileSync(path.join(proj, '.h-stack', 'active-session'), sid + '\n');
  const routeFile = path.join(sessionDir(proj, sid), 'route.json');
  const prev = readJson(routeFile, {});
  const kind = SECRET_KINDS.find(([re]) => re.test(prompt));
  const secretKind = kind ? kind[1] : (looksLikeSecret(prompt) ? 'credential' : null);
  const { route, line } = classify(prompt, loadIndex(), prev, { secretKind });
  const trusted = [...new Set([...(prev.trusted_values || []), ...trustedValues(prompt)])].slice(-500);
  const next = {
    ...route,
    prompt_id: input.prompt_id || null,
    prompt_excerpt: secretKind ? '' : redact(prompt).slice(0, 200),
    verify: effortFor(readJson(path.join(stateDir(proj), 'solo-boundary.json'), {})[taskClass({ picked: route.skills, size: route.size })]),
    turn_seq: (prev.turn_seq || 0) + 1,
    turn_tree: treeHash(proj),
    trusted_values: trusted,
    scope_numbers: route.override === 'why-that' ? prev.scope_numbers || [] : [...prompt.matchAll(/(?:#|\b(?:issue|pr|pull request)\s+#?)(\d{1,7})\b/gi)].map((m) => m[1]),
  };
  writeJsonAtomic(routeFile, next);
  // HS-021: a correction becomes a context-keyed routing example for description tuning.
  if (CORRECTION.test(prompt) && (prev.skills || []).length) appendLine(path.join(stateDir(proj), 'routing-examples.jsonl'), { ts: Date.now(), prompt: prev.prompt_excerpt || '', picked: prev.skills, rules: prev.rules || [], correction: redact(prompt).slice(0, 200) }, proj);
  logActivation(proj, {
    session: sid, prompt, size: route.size, picked: route.skills, rules: route.rules, override: route.override,
    correction_of_previous: CORRECTION.test(prompt) ? (prev.skills || []) : null,
  });
  const lessons = route.size === 'direct' ? [] : retrieveLessons(proj, prompt);
  return context('UserPromptSubmit', [line, ...lessons].filter(Boolean).join('\n'));
});
