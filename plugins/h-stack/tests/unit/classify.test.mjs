import test from 'node:test';
import assert from 'node:assert/strict';
import { classify, sizeOf } from '../../lib/pure/classify-rules.mjs';

const index = { skills: [
  { name: 'debugging', qualified: 'h-stack:debugging', keywords: ['\\btraceback\\b', '\\bfail(s|ing|ed)?\\b'], intents: ['bug'], not_for: [], sizes: ['light', 'full'] },
  { name: 'perf', qualified: 'h-stack:perf', keywords: ['\\bslow\\b', '\\blatency\\b'], intents: [], not_for: [], sizes: ['light', 'full'] },
  { name: 'clarify', qualified: 'h-stack:clarify', keywords: ['\\bunclear\\b'], intents: [], not_for: [], sizes: ['light', 'full'] },
  { name: 'long-run', qualified: 'h-stack:long-run', keywords: ['\\bovernight\\b'], intents: [], not_for: [], sizes: ['light', 'full'], explicit_only: true, explicit_phrases: ['\\bovernight\\b'] },
] };
test('direct prompts add nothing', () => {
  assert.equal(classify('thanks!', index).line, '');
  assert.equal(sizeOf('what time is it?', 0), 'direct');
});
test('matches at most two skills with a factual line', () => {
  const r = classify('the build is slow and tests fail with a traceback', index);
  assert.ok(r.route.skills.length <= 2);
  assert.match(r.line, /^H-Stack: size=light\. Relevant skills? /);
});
test('full prompts get the intent check', () => {
  const r = classify('Implement a new feature: CSV export across the API and the web app', index);
  assert.equal(r.route.size, 'full');
  assert.ok(r.route.skills.includes('h-stack:clarify'));
});
test('overrides: just do it, stop using, why that', () => {
  assert.equal(classify('fix the failing test, just do it', index).route.no_questions, true);
  const s = classify('stop using debugging. the test fails', index);
  assert.ok(!s.route.skills.includes('h-stack:debugging'));
  const w = classify('why that?', index, { size: 'light', skills: ['h-stack:perf'], rules: ['matched "slow"'] });
  assert.match(w.line, /h-stack:perf because matched "slow"/);
});
test('explicit-only skills need their phrase and are recorded', () => {
  const r = classify('run this overnight please, the test fails', index);
  assert.ok(r.route.explicit.includes('h-stack:long-run'));
});
