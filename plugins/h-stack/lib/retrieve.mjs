// HS-048/HS-049 retrieval: at most two committed lessons whose trigger matches the prompt,
// injected with their evidence excerpt. Lessons are never always-on.
import { loadLessons } from './memory.mjs';

const STOP = new Set(['when', 'with', 'that', 'this', 'from', 'into', 'editing', 'file', 'files', 'code', 'change', 'changes', 'make', 'have', 'there', 'their', 'about', 'should', 'would', 'could']);
const words = (s) => new Set(String(s).toLowerCase().match(/[a-z_][a-z0-9_./-]{3,}/g)?.filter((w) => !STOP.has(w)) || []);

export function retrieveLessons(proj, prompt, max = 2) {
  const pw = words(prompt);
  const ticks = new Set((String(prompt).match(/`([^`]+)`/g) || []).map((t) => t.slice(1, -1).toLowerCase()));
  const scored = [];
  for (const file of loadLessons(proj)) for (const e of file.entries) {
    const tw = words(`${e.id} ${e.trigger} ${e.applies}`);
    let score = 0;
    for (const w of tw) if (pw.has(w)) score += w.includes('/') || w.includes('.') || w.includes('_') ? 3 : 1;
    for (const t of ticks) if (`${e.trigger} ${e.applies}`.toLowerCase().includes(t)) score += 3;
    if (score >= 3) scored.push({ score, file: file.file, e });
  }
  scored.sort((a, b) => b.score - a.score || a.e.id.localeCompare(b.e.id));
  return scored.slice(0, max).map(({ file, e }) => {
    const excerpt = e.evidence.replace(/^```\w*\n?|```$/g, '').trim().split('\n').slice(0, 8).join(' | ').slice(0, 600);
    return `H-Stack lesson ${e.id} (${file}): ${e.trigger}; applies when ${e.applies}; not when ${e.not_applies}. Evidence: ${excerpt}`;
  });
}
