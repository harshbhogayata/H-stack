// HS-002 trigger sets: should-trigger and should-not-trigger prompts per skill, run through the
// real classifier and the generated index. One-sided sets reward one-sided behaviour (N123).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { classify } from '../../lib/pure/classify-rules.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '..');
const index = JSON.parse(fs.readFileSync(path.join(ROOT, 'index.json'), 'utf8'));
const sets = {};
for (const f of fs.readdirSync(path.join(ROOT, 'tests', 'triggers'))) Object.assign(sets, JSON.parse(fs.readFileSync(path.join(ROOT, 'tests', 'triggers', f), 'utf8')));

test('trigger sets: recall >= 0.8 and false positives <= 0.2 per skill', () => {
  const report = [];
  for (const [skill, s] of Object.entries(sets)) {
    if (!index.skills.some((x) => x.qualified === skill)) continue;
    const hit = (p) => classify(p, index, {}).route.skills.includes(skill);
    const recall = s.should.filter(hit).length / s.should.length;
    const fp = s.should_not.filter(hit).length / s.should_not.length;
    report.push(`${skill}: recall ${recall.toFixed(2)}, false-positive ${fp.toFixed(2)}`);
    assert.ok(recall >= 0.8, `${skill} recall ${recall} (missed: ${s.should.filter((p) => !hit(p)).join(' | ')})`);
    assert.ok(fp <= 0.2, `${skill} false positives ${fp} (${s.should_not.filter(hit).join(' | ')})`);
  }
  console.log(report.join('\n'));
});
