// HS-018 rules classifier. Pure module: no Node imports, so both the
// UserPromptSubmit command hook and the mod (HS-019) can use it.

export const OVERRIDES = [
  { id: 'just-do-it', re: /\b(just do it|skip the plan|no questions|just build it|don'?t ask)\b/i, effect: { size: 'light', no_questions: true } },
  { id: 'go-deep', re: /\b(go deep|be thorough|full process|deep dive)\b/i, effect: { size: 'full' } },
  { id: 'why-that', re: /^\s*(why that|why this skill|why did you pick (that|this)|why h-stack)\b\??/i, effect: { explain: true } },
  { id: 'stop-using', re: /\bstop using (?:h-stack:)?([a-z0-9-]+)/i, effect: { exclude: true } },
];

const CONTINUATION = /^\s*(continue|next|go on|keep going|carry on|proceed|fix that|do that|do it|yes|yep|ok(ay)?|sounds good|go ahead|resume)\b[\s.!]*$/i;
const CODE_NOUNS = /(`|\b(function|class|method|file|test|tests|bug|error|exception|stack ?trace|api|endpoint|component|module|repo|build|deploy|commit|pr|branch|query|schema|migration|css|html|script|config|lint|type ?check|refactor|crash|regression|dependency|package)\b|\w\.(js|ts|tsx|jsx|py|go|rs|rb|java|kt|cs|php|md|json|ya?ml|toml|sql|sh)\b|\w\/\w)/i;
const FULL_CUES = /\b(implement|build (a|an|the|out)|add (a |an |the )?(new )?(feature|endpoint|page|screen|service|integration|command)|new feature|from scratch|refactor|migrat(e|ion)|redesign|rewrite|architecture|across (the )?(code ?base|files|modules|services)|multiple files|end[- ]to[- ]end|overhaul|port (it |this )?to)\b/i;
const QUESTION = /^\s*(what|why|how|where|when|who|which|is|are|does|do|can|could|should|explain)\b.*\?\s*$/is;

export function sizeOf(prompt, matched) {
  const p = String(prompt || '');
  if (FULL_CUES.test(p) || p.length > 900) return 'full';
  if (p.length < 120 && !CODE_NOUNS.test(p) && matched === 0) return 'direct';
  if (QUESTION.test(p) && p.length < 160 && matched === 0) return 'direct';
  return 'light';
}

function scoreSkill(skill, prompt) {
  let score = 0;
  let rule = null;
  for (const k of skill.keywords || []) {
    let re;
    try { re = new RegExp(k, 'i'); } catch { continue; }
    const m = prompt.match(re);
    if (m) { score += 2; if (!rule) rule = `matched "${m[0].slice(0, 40)}"`; }
  }
  for (const intent of skill.intents || []) {
    const word = String(intent).replace(/-/g, '[ -]?');
    if (new RegExp(`\\b${word}`, 'i').test(prompt)) { score += 1; if (!rule) rule = `intent ${intent}`; }
  }
  return { score, rule };
}

function explicitAsked(skill, prompt) {
  return (skill.explicit_phrases || []).some((p) => { try { return new RegExp(p, 'i').test(prompt); } catch { return false; } });
}

// state: previous route.json content (or {}). Returns { route, line }.
export function classify(prompt, index, state = {}, opts = {}) {
  const text = String(prompt || '');
  const skills = (index && index.skills) || [];
  const route = {
    excluded: [...(state.excluded || [])],
    no_questions: false,
    size: null,
    skills: [],
    rules: [],
    explicit: [],
    playbook: state.playbook || null,
    override: null,
  };

  for (const o of OVERRIDES) {
    const m = text.match(o.re);
    if (!m) continue;
    route.override = o.id;
    if (o.effect.explain) {
      const last = state.skills && state.skills.length
        ? `H-Stack picked ${state.skills.join(', ')} because ${state.rules.join('; ')} (size=${state.size}).`
        : `H-Stack picked no skill for the previous prompt (size=${state.size || 'direct'}).`;
      return { route: { ...state, override: 'why-that' }, line: last };
    }
    if (o.effect.exclude) {
      const name = `h-stack:${m[1].toLowerCase()}`;
      if (!route.excluded.includes(name)) route.excluded.push(name);
    }
    if (o.effect.size) route.size = o.effect.size;
    if (o.effect.no_questions) route.no_questions = true;
  }

  // Sticky playbook: continuation phrases keep the active skills.
  if (CONTINUATION.test(text) && state.playbook && (state.skills || []).length) {
    route.size = state.size || 'light';
    route.skills = state.skills.filter((s) => !route.excluded.includes(s));
    route.rules = ['continuation of the active playbook'];
    route.playbook = state.playbook;
    if (!route.skills.length) return { route, line: '' };
    return { route, line: `H-Stack: size=${route.size}. Continuing with ${route.skills.join(', ')}.` };
  }

  const scored = [];
  for (const s of skills) {
    if (route.excluded.includes(s.qualified)) continue;
    const { score, rule } = scoreSkill(s, text);
    if (score < 2) continue;
    if (s.explicit_only && !explicitAsked(s, text)) continue;
    scored.push({ s, score, rule });
  }
  // not_for: drop a skill when a sibling it says it is not for also matched.
  const names = new Set(scored.map((x) => x.s.qualified));
  let kept = scored.filter((x) => !(x.s.not_for || []).some((n) => names.has(n)));
  const size = route.size || sizeOf(text, kept.length);
  route.size = size;
  if (size === 'direct' && !route.override) {
    route.playbook = null;
    return { route, line: '' };
  }
  kept = kept.filter((x) => (x.s.sizes || ['light', 'full']).includes(size));
  kept.sort((a, b) => b.score - a.score || a.s.name.localeCompare(b.s.name));
  kept = kept.slice(0, 2);
  route.skills = kept.map((x) => x.s.qualified);
  route.rules = kept.map((x) => x.rule);
  route.explicit = kept.filter((x) => x.s.explicit_only).map((x) => x.s.qualified);
  route.playbook = route.skills[0] || null;

  // Act/ask/stop (HS-020): full prompts get the intent check unless the user said "just do it".
  const clarify = skills.find((s) => s.name === 'clarify');
  if (size === 'full' && !route.no_questions && clarify && !route.excluded.includes(clarify.qualified) && !route.skills.includes(clarify.qualified)) {
    if (route.skills.length >= 2) route.skills.pop(), route.rules.pop();
    route.skills.push(clarify.qualified);
    route.rules.push('size=full needs an act/ask/stop check before the first edit');
  }

  const parts = [`H-Stack: size=${size}.`];
  if (route.no_questions) parts.push('User said to proceed without questions; log assumptions with hs assume.');
  if (route.skills.length === 1) parts.push(`Relevant skill: ${route.skills[0]} because ${route.rules[0]}.`);
  else if (route.skills.length === 2) parts.push(`Relevant skills: ${route.skills[0]} (${route.rules[0]}), ${route.skills[1]} (${route.rules[1]}).`);
  if (opts.secretKind) parts.push(`The prompt appears to contain a ${opts.secretKind}; H-Stack did not store it. Rotating it is safer.`);
  const line = route.skills.length || route.no_questions || opts.secretKind ? parts.join(' ') : '';
  return { route, line };
}
