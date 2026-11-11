// HS-049 lesson validator: committed, path-scoped lessons with applicability bounds and an
// evidence excerpt (HS-048). Rejects generic advice, untrusted provenance and always-on lessons.
import { splitFrontmatter } from './yaml.mjs';

const GENERIC = /\b(write (clean|good|better) code|be careful|follow best practices|always (test|write tests)|make sure (to|that) (it|the code) works|use common sense|keep (it|things) simple|think (carefully|step by step)|double[- ]check everything|code quality matters|avoid bugs)\b/i;
const SPECIFIC = /(`[^`]+`|[\w./-]+\.\w{1,5}\b|\b[a-z]+[A-Z]\w+\b|\b\w+_\w+\b|--[\w-]+|\b(npm|pnpm|yarn|pytest|go|cargo|make|git|docker|kubectl)\s+\w+)/;
const MAX_EVIDENCE_BYTES = 900; // ~300 tokens at ceil(bytes/3)

export function validateLessonText(text) {
  const errors = [];
  const { data, body } = splitFrontmatter(String(text || ''));
  if (!data) errors.push('missing frontmatter');
  const paths = data && data.paths;
  if (!Array.isArray(paths) || !paths.length) errors.push('paths: frontmatter must list at least one glob (lessons are never always-on)');
  const entries = String(body || '').split(/^### /m).slice(1);
  if (!entries.length) errors.push('no lesson entries (### <id> <title>)');
  const ids = new Set();
  for (const chunk of entries) {
    const [title, ...lines] = chunk.split('\n');
    const id = title.trim().split(/\s+/)[0];
    const rest = lines.join('\n');
    const field = (name) => (rest.match(new RegExp(`^- \\*\\*${name}:\\*\\*\\s*(.*)$`, 'mi')) || [])[1];
    if (ids.has(id)) errors.push(`${id}: duplicate id`);
    ids.add(id);
    for (const name of ['Trigger', 'Applies when', "Doesn't apply when", 'Provenance', 'Date', 'Evidence']) if (field(name) === undefined) errors.push(`${id}: missing **${name}:**`);
    const prov = (field('Provenance') || '').trim().toLowerCase();
    if (prov && !['user', 'executed'].includes(prov)) errors.push(`${id}: provenance must be user or executed (untrusted-derived text is never promoted)`);
    const ev = (rest.match(/```[\s\S]*?```/) || [''])[0];
    if (!ev) errors.push(`${id}: evidence excerpt (fenced block) missing`);
    if (Buffer.byteLength(ev) > MAX_EVIDENCE_BYTES) errors.push(`${id}: evidence excerpt over ~300 tokens`);
    const trig = `${title} ${field('Trigger') || ''} ${field('Applies when') || ''}`;
    if (GENERIC.test(trig) || GENERIC.test(rest.replace(/```[\s\S]*?```/g, ''))) errors.push(`${id}: generic advice; lessons encode a project-specific condition`);
    if (!SPECIFIC.test(`${trig} ${ev}`)) errors.push(`${id}: no project-specific anchor (path, identifier, command) in trigger or evidence`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test((field('Date') || '').trim())) errors.push(`${id}: Date must be YYYY-MM-DD`);
  }
  return { ok: errors.length === 0, errors };
}
