// Pure decision rules for "show the result" and "use what the session can do" (HS-086, HS-087),
// used by the mods module. No Node imports. The mod never opens anything itself: it tells Claude,
// once, that a viewable output was written and not opened, so the user sees the open command.

// HS-086 + HS-087: the one always-on rule, sent only in interactive sessions (prompt.compose).
export const SHOW_RULE = "H-Stack (interactive session). Show results: when finished work can be looked at (page, UI, image, PDF, document), open it for the user once, at the end: the session's own preview, file or artifact tool if it has one, else the default browser or app (start, open, xdg-open). Needs a server: reuse one already listening, else start the project's dev command once; say what is left running (port, how to stop). Later edits: say refresh. Not for self-check screenshots. No display (SSH, container, cloud): give the path or URL. Brainstorming, comparing or explaining: if the answer is spatial or a choice between concrete options, use the visual tools in this session's tool list (page, diagram, option previews); text if a sentence answers.";

const FILE = /\.(html?|svg|pdf|png|jpe?g|gif|webp|avif|docx|pptx|xlsx|odt|odp|ods)$/i;
const UI = /\.(tsx|jsx|vue|svelte|astro|css|scss|sass|less)$/i;
const NOT_OUTPUT = /(^|[\\/])(node_modules|\.h-stack|\.git|tests?|__tests__|spec|fixtures?|snapshots?|__snapshots__|coverage|screenshots?)([\\/]|$)|\.(test|spec|stories)\.[a-z]+$/i;
const EDIT_TOOLS = new Set(['Edit', 'Write', 'MultiEdit', 'NotebookEdit']);
const SHELL_OPEN = /(^|[\s;&|(])(start|start-process|saps|open|xdg-open|gio\s+open|wslview|explorer(\.exe)?|invoke-item|ii|cygstart)\s/i;
// A tool that puts something in front of the user, named the way the session names it (preview pane,
// artifact, send-file, browser). Read off the call, not a fixed list of tool names.
const SHOW_TOOL = /artifact|preview|send_?user_?file|senduser|browser|navigate|present|open_?url|show_?file/i;
const LOCAL_URL = /\bhttps?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])(:\d+)?/i;

const base = (p) => String(p).split(/[\\/]/).pop();

// What kind of output a written path is: 'file' (open it directly), 'ui' (seen through a server), or null.
export function outputKind(p) {
  const s = String(p || '');
  if (!s || NOT_OUTPUT.test(s)) return null;
  if (FILE.test(s)) return 'file';
  if (UI.test(s)) return 'ui';
  return null;
}

// True when one of the turn's calls put this output in front of the user.
export function wasOpened(kind, p, calls) {
  const name = base(p).toLowerCase();
  return calls.some(({ tool, text }) => {
    if (EDIT_TOOLS.has(tool) || tool === 'Read') return false;
    const t = String(text || '').toLowerCase();
    const shell = tool === 'Bash' || tool === 'PowerShell';
    if (shell && !SHELL_OPEN.test(t)) return false;
    if (!shell && !SHOW_TOOL.test(tool)) return false;
    if (kind === 'ui') return LOCAL_URL.test(t) || !shell;
    return t.includes(name) || (!shell && LOCAL_URL.test(t));
  });
}

// The factual note for the end of an interactive turn, or null. `seen` holds the outputs already
// noted or opened this session (keys: a path, or 'ui'), so a later edit of the same output adds nothing.
export function showNote({ written = [], calls = [], seen = new Set(), noDisplay = false }) {
  const files = []; const ui = [];
  for (const p of [...new Set(written)]) {
    const kind = outputKind(p);
    if (!kind) continue;
    const key = kind === 'ui' ? 'ui' : p;
    if (seen.has(key)) continue;
    if (wasOpened(kind, p, calls)) { seen.add(key); continue; }
    if (kind === 'file') files.push(p); else ui.push(p);
  }
  if (!files.length && !ui.length) return null;
  const parts = [];
  if (files.length) { for (const p of files) seen.add(p); parts.push(`this turn wrote ${files.slice(0, 3).join(', ')}${files.length > 3 ? ` (+${files.length - 3})` : ''}; it has not been opened for the user`); }
  if (ui.length) { seen.add('ui'); parts.push(`this turn changed UI files (${base(ui[0])}${ui.length > 1 ? ` +${ui.length - 1}` : ''}); the page has not been opened for the user`); }
  return `H-Stack show-results: ${parts.join('; ')}.${noDisplay ? ' No local display: give the path or URL.' : ''}`;
}
