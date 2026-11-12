// HS-086 show results: which written files count as viewable output, what counts as opened, once per output.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { outputKind, wasOpened, showNote } from '../../lib/pure/show-rules.mjs';

test('viewable outputs: documents and images open directly, UI sources need a server, tests and state do not count', () => {
  for (const p of ['index.html', 'site/landing.htm', 'out/report.pdf', 'logo.svg', 'deck.pptx', 'chart.png']) assert.equal(outputKind(p), 'file', p);
  for (const p of ['src/components/Hero.tsx', 'app/page.jsx', 'src/App.vue', 'styles/site.css']) assert.equal(outputKind(p), 'ui', p);
  for (const p of ['README.md', 'src/api.ts', 'tests/fixture.html', 'src/Hero.test.tsx', '.h-stack/logs/x.html', 'screenshots/check.png', 'node_modules/a/index.html']) assert.equal(outputKind(p), null, p);
});

test('opened: a shell open command naming the file, or a session tool that shows it', () => {
  assert.equal(wasOpened('file', 'site/index.html', [{ tool: 'Bash', text: 'start site/index.html' }]), true);
  assert.equal(wasOpened('file', 'site/index.html', [{ tool: 'PowerShell', text: 'Start-Process .\\site\\index.html' }]), true);
  assert.equal(wasOpened('file', 'index.html', [{ tool: 'Bash', text: 'xdg-open index.html' }]), true);
  assert.equal(wasOpened('file', 'index.html', [{ tool: 'mcp__preview__open_file', text: '{"path":"index.html"}' }]), true);
  assert.equal(wasOpened('file', 'index.html', [{ tool: 'Bash', text: 'cat index.html' }]), false);
  assert.equal(wasOpened('file', 'index.html', [{ tool: 'Bash', text: 'open other.html' }]), false);
  assert.equal(wasOpened('ui', 'src/Hero.tsx', [{ tool: 'Bash', text: 'open http://localhost:5173' }]), true);
  assert.equal(wasOpened('ui', 'src/Hero.tsx', [{ tool: 'Bash', text: 'npm run dev' }]), false);
});

test('the note: once per output per session, factual, and nothing once opened', () => {
  const seen = new Set();
  assert.equal(showNote({ written: ['index.html'], seen }), 'H-Stack show-results: this turn wrote index.html; it has not been opened for the user.');
  assert.equal(showNote({ written: ['index.html'], seen }), null, 'a later edit of the same page adds nothing');
  assert.equal(showNote({ written: ['index.html'], calls: [{ tool: 'Bash', text: 'start index.html' }] }), null);
  assert.equal(showNote({ written: ['src/api.ts'] }), null);
  assert.match(showNote({ written: ['src/Hero.tsx', 'src/hero.css'] }), /UI files \(Hero\.tsx \+1\); the page has not been opened/);
  assert.match(showNote({ written: ['index.html'], noDisplay: true }), /No local display: give the path or URL\.$/);
  assert.doesNotMatch(showNote({ written: ['index.html'] }), /YOU MUST|must/);
});
