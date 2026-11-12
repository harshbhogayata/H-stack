// PowerShell commands for the Bash gates (Claude Code's PowerShell tool on Windows).
// Not a PowerShell parser: a tokenizer for the forms real commands use (statements split on ; newline |
// && ||, the & call operator, backtick escapes, '' and "" quotes, $( ) / ( ) / { } bodies, here-strings,
// redirects). Each statement comes out in the shape lib/shell.mjs returns ({ argv, env, redirects }),
// with cmdlets and their aliases mapped onto the commands the gates already check: Remove-Item -> rm,
// Set-Content / Out-File -> tee, Move-Item -> mv, Copy-Item -> cp, Invoke-WebRequest -> curl,
// Get-Content -> cat. Native programs (git, gh, npm, curl.exe) pass through as they are.
import { parseCommands } from './shell.mjs';

// Bash for tool_name Bash, this tokenizer for PowerShell.
export function parseShell(src, shell = 'bash') {
  return shell === 'powershell' ? parsePowerShell(src) : parseCommands(src);
}
export const shellOf = (input) => (input?.tool_name === 'PowerShell' ? 'powershell' : 'bash');

// Text form for the secret patterns: forward slashes, and $env:NAME / ${env:NAME} as $NAME.
export function pwshText(s) {
  return String(s ?? '').replace(/\\/g, '/').replace(/\$\{?env:([A-Za-z_][A-Za-z0-9_]*)\}?/gi, (m, n) => '$' + n.toUpperCase());
}

// Split into statements; bodies of $( ), @( ), ( ) and { } become separate sources.
function split(src) {
  const parts = []; const subs = []; const piped = [];
  let cur = ''; let nextPiped = false;
  const flush = (pipe = false) => { if (cur.trim()) { parts.push(cur.trim()); piped.push(nextPiped); } cur = ''; nextPiped = pipe; };
  const group = (i, open, close) => {
    let d = 1; let j = i + 1; let q = null;
    for (; j < src.length && d > 0; j++) {
      const c = src[j];
      if (q) { if (c === '`' && q === '"') j++; else if (c === q) q = null; continue; }
      if (c === "'" || c === '"') q = c;
      else if (c === '`') j++;
      else if (c === open) d++;
      else if (c === close) d--;
    }
    subs.push(src.slice(i + 1, d > 0 ? j : j - 1));
    return j;
  };
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    // here-strings: @' ... '@ and @" ... "@, closing marker at the start of a line
    if (c === '@' && (src[i + 1] === "'" || src[i + 1] === '"') && /^[ \t]*\r?\n/.test(src.slice(i + 2))) {
      const q = src[i + 1];
      const start = src.indexOf('\n', i + 2) + 1;
      const m = new RegExp(`\\r?\\n${q}@`).exec(src.slice(start));
      const end = m ? start + m.index : src.length;
      const body = src.slice(start, end);
      if (q === '"') for (let k = body.indexOf('$('); k >= 0; k = body.indexOf('$(', k + 2)) subs.push(innerParen(body, k + 1));
      cur += `'${body.replace(/'/g, "''")}'`;
      i = m ? end + m[0].length - 1 : src.length;
      continue;
    }
    if (c === "'") {
      let j = i + 1;
      for (; j < src.length; j++) { if (src[j] === "'") { if (src[j + 1] === "'") { j++; continue; } break; } }
      cur += src.slice(i, j + 1); i = j; continue;
    }
    if (c === '"') {
      let j = i + 1; let s = '"';
      for (; j < src.length && src[j] !== '"'; j++) {
        if (src[j] === '`' && j + 1 < src.length) { s += src[j] + src[j + 1]; j++; continue; }
        if (src[j] === '$' && src[j + 1] === '(') { const k = group(j + 1, '(', ')'); s += '$(…)'; j = k - 1; continue; }
        s += src[j];
      }
      cur += s + '"'; i = j; continue;
    }
    if (c === '`') { if (src[i + 1] === '\n' || (src[i + 1] === '\r' && src[i + 2] === '\n')) { i += src[i + 1] === '\r' ? 2 : 1; cur += ' '; } else { cur += c + (src[i + 1] ?? ''); i++; } continue; }
    if (c === '#' && (!cur || /\s$/.test(cur))) { const e = src.indexOf('\n', i); i = e < 0 ? src.length : e - 1; continue; }
    if (c === '<' && src[i + 1] === '#') { const e = src.indexOf('#>', i + 2); i = e < 0 ? src.length : e + 1; continue; }
    if (c === '$' && src[i + 1] === '{') { const e = src.indexOf('}', i); cur += e < 0 ? src.slice(i) : src.slice(i, e + 1); i = e < 0 ? src.length : e; continue; }
    if (c === '(' || c === '{') { const close = c === '(' ? ')' : '}'; const j = group(i, c, close); if (cur.endsWith('$') || cur.endsWith('@')) cur = cur.slice(0, -1); cur += c === '(' ? '(…)' : '{…}'; i = j - 1; continue; }
    if (c === ';' || c === '\n' || c === '\r') { flush(); continue; }
    if (c === '|') { if (src[i + 1] === '|') { flush(); i++; } else flush(true); continue; }
    if (c === '&') {
      if (src[i + 1] === '&') { flush(); i++; continue; }
      if (cur.endsWith('>')) { cur += c; continue; } // 2>&1
      if (/^[ \t]*(;|\r?\n|$)/.test(src.slice(i + 1))) { flush(); continue; } // trailing & (background job)
    }
    cur += c;
  }
  flush();
  return { parts, subs, piped };
}
function innerParen(s, i) {
  let d = 0;
  for (let j = i; j < s.length; j++) { if (s[j] === '(') d++; else if (s[j] === ')' && --d === 0) return s.slice(i + 1, j); }
  return s.slice(i + 1);
}

// Tokens with quotes removed; commas outside quotes separate arguments (PowerShell arrays).
function tokenize(part) {
  const argv = []; const redirects = [];
  let cur = ''; let has = false; let pendingRedirect = null; let quoted = false; let quotedFirst = false;
  const push = () => {
    if (!has) return;
    const t = cur.replace(/\\/g, '/');
    if (pendingRedirect) { redirects.push({ op: pendingRedirect, target: /^\$null$/i.test(t) ? '/dev/null' : t }); pendingRedirect = null; } else { if (!argv.length) quotedFirst = quoted; argv.push(t); }
    cur = ''; has = false; quoted = false;
  };
  for (let i = 0; i < part.length; i++) {
    const c = part[i];
    if (c === "'") {
      let j = i + 1;
      for (; j < part.length; j++) { if (part[j] === "'") { if (part[j + 1] === "'") { cur += "'"; j++; continue; } break; } cur += part[j]; }
      has = true; quoted = true; i = j; continue;
    }
    if (c === '"') {
      let j = i + 1;
      for (; j < part.length && part[j] !== '"'; j++) { if (part[j] === '`' && j + 1 < part.length) { cur += part[++j]; continue; } cur += part[j]; }
      has = true; quoted = true; i = j; continue;
    }
    if (c === '`' && i + 1 < part.length) { cur += part[++i]; has = true; continue; }
    if (/\s/.test(c) || c === ',') { push(); continue; }
    if (c === '>') {
      if (/^[1-6*]$/.test(cur)) { cur = ''; has = false; } else push();
      let op = '>';
      if (part[i + 1] === '>') { op = '>>'; i++; }
      if (part[i + 1] === '&' && /\d/.test(part[i + 2] || '')) { i += 2; continue; } // 2>&1: a stream merge, no file
      pendingRedirect = op; continue;
    }
    cur += c; has = true;
  }
  push();
  return { argv, redirects, quotedFirst };
}

// ---------- cmdlet parameters (case-insensitive, unique prefixes, -Name:value) ----------
const COMMON_VALUE = ['ErrorAction', 'WarningAction', 'InformationAction', 'ErrorVariable', 'WarningVariable', 'InformationVariable', 'OutVariable', 'OutBuffer', 'PipelineVariable'];
const COMMON_SWITCH = ['Verbose', 'Debug', 'WhatIf', 'Confirm'];
const COMMON_ALIAS = { ea: 'ErrorAction', wa: 'WarningAction', infa: 'InformationAction', ev: 'ErrorVariable', wv: 'WarningVariable', iv: 'InformationVariable', ov: 'OutVariable', ob: 'OutBuffer', pv: 'PipelineVariable', vb: 'Verbose', db: 'Debug', wi: 'WhatIf', cf: 'Confirm' };

function bind(args, spec) {
  const values = [...(spec.value || []), ...COMMON_VALUE];
  const names = [...values, ...(spec.switch || []), ...COMMON_SWITCH];
  const out = { _: [] };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    const m = /^-([A-Za-z][\w-]*)(?::(.*))?$/.exec(a);
    if (!m) { out._.push(a); continue; }
    const key = m[1].toLowerCase();
    const alias = spec.alias?.[key] || COMMON_ALIAS[key];
    const exact = names.find((n) => n.toLowerCase() === key);
    const hits = alias ? [alias] : exact ? [exact] : names.filter((n) => n.toLowerCase().startsWith(key));
    if (hits.length !== 1) { (out._unknown ||= []).push(a); continue; }
    const name = hits[0];
    if (values.includes(name)) { const v = m[2] !== undefined ? m[2] : args[++i]; if (v !== undefined) (out[name] ||= []).push(v); } else out[name] = [m[2] ?? true];
  }
  for (const p of spec.positional || []) if (!out[p] && out._.length) out[p] = [out._.shift()];
  return out;
}
const first = (b, ...keys) => { for (const k of keys) if (b[k]?.length) return b[k]; return []; };

const PATHS = { value: ['Path', 'LiteralPath', 'Filter', 'Include', 'Exclude', 'Credential', 'Stream'], alias: { lp: 'LiteralPath', pspath: 'LiteralPath' }, positional: ['Path'] };
const SPECS = {
  rm: { ...PATHS, switch: ['Recurse', 'Force'] },
  tee: { ...PATHS, value: [...PATHS.value, 'Value', 'Encoding', 'FilePath', 'InputObject', 'Width', 'ItemType', 'Name', 'Variable'], switch: ['Force', 'NoNewline', 'PassThru', 'Append', 'NoClobber', 'AsByteStream'], positional: ['Path', 'Value'] },
  move: { ...PATHS, value: [...PATHS.value, 'Destination', 'NewName', 'ToSession', 'FromSession'], switch: ['Recurse', 'Force', 'PassThru', 'Container'], positional: ['Path', 'Destination'] },
  start: { value: ['FilePath', 'ArgumentList', 'WorkingDirectory', 'Verb', 'WindowStyle', 'RedirectStandardOutput', 'RedirectStandardError', 'RedirectStandardInput', 'Credential'], alias: { args: 'ArgumentList', file: 'FilePath', path: 'FilePath' }, switch: ['Wait', 'NoNewWindow', 'PassThru', 'LoadUserProfile', 'UseNewEnvironment'], positional: ['FilePath', 'ArgumentList'] },
  iex: { value: ['Command'], positional: ['Command'] },
  web: { value: ['Uri', 'Method', 'Body', 'InFile', 'OutFile', 'Headers', 'Form', 'ContentType', 'UserAgent', 'Credential', 'WebSession', 'SessionVariable', 'TimeoutSec', 'Proxy', 'ProxyCredential', 'Certificate', 'CertificateThumbprint', 'MaximumRedirection', 'MaximumRetryCount', 'RetryIntervalSec', 'TransferEncoding', 'CustomMethod', 'Authentication', 'Token', 'HttpVersion', 'ConnectionTimeoutSeconds', 'OperationTimeoutSeconds', 'ResponseHeadersVariable', 'StatusCodeVariable'], alias: { sv: 'SessionVariable' }, switch: ['UseBasicParsing', 'UseDefaultCredentials', 'DisableKeepAlive', 'PassThru', 'ProxyUseDefaultCredentials', 'SkipCertificateCheck', 'SkipHeaderValidation', 'SkipHttpErrorCheck', 'Resume', 'NoProxy', 'PreserveAuthorizationOnRedirect', 'AllowUnencryptedAuthentication', 'AllowInsecureRedirect', 'PreserveHttpMethodOnRedirect'], positional: ['Uri'] },
};

const ALIASES = {
  rm: ['remove-item', 'rm', 'ri', 'del', 'erase', 'rd', 'rmdir'],
  set: ['set-content', 'sc', 'add-content', 'ac', 'out-file', 'tee-object', 'tee', 'new-item', 'ni', 'clear-content', 'clc'],
  mv: ['move-item', 'mi', 'mv', 'move', 'rename-item', 'rni', 'ren'],
  cp: ['copy-item', 'cpi', 'cp', 'copy'],
  web: ['invoke-webrequest', 'iwr', 'invoke-restmethod', 'irm', 'curl', 'wget'],
  start: ['start-process', 'saps', 'start'],
  iex: ['invoke-expression', 'iex'],
};
const KIND = new Map(Object.entries(ALIASES).flatMap(([k, names]) => names.map((n) => [n, k])));
// Read-only cmdlets under the names the gates already treat as readers (and claimKinds as no-ops).
const READERS = {
  cat: ['get-content', 'gc', 'cat', 'type'], ls: ['get-childitem', 'gci', 'ls', 'dir'], grep: ['select-string', 'sls'],
  stat: ['get-item', 'gi', 'test-path', 'resolve-path', 'rvpa', 'get-itemproperty', 'gp', 'split-path', 'join-path', 'get-filehash', 'get-acl'],
  wc: ['measure-object', 'measure'], diff: ['compare-object', 'compare', 'diff'], jq: ['convertfrom-json'],
  echo: ['write-output', 'echo', 'write', 'write-host', 'out-host', 'out-null', 'out-string'], cd: ['set-location', 'cd', 'sl', 'chdir', 'push-location', 'pushd', 'pop-location', 'popd'], sleep: ['start-sleep'],
};
const READER = new Map(Object.entries(READERS).flatMap(([k, names]) => names.map((n) => [n, k])));
const KEYWORDS = new Set(['if', 'elseif', 'else', 'while', 'for', 'foreach', 'switch', 'try', 'catch', 'finally', 'do', 'until', 'return', 'throw', 'exit', 'break', 'continue', 'param', 'function', 'filter', 'trap', 'begin', 'process', 'end', '(…)', '{…}']);

const exeName = (a) => String(a || '').split('/').pop().toLowerCase().replace(/\.(exe|cmd|bat|com)$/, '');

// One statement -> commands in shell.mjs shape.
function translate(argv, env, redirects, depth) {
  const out = (a, r = redirects) => [{ argv: a, env, redirects: r }];
  if (!argv.length) return redirects.length ? out([]) : [];
  const name = exeName(argv[0]);
  const rest = argv.slice(1);
  const kind = KIND.get(name);
  // curl and wget are aliases of Invoke-WebRequest in Windows PowerShell 5.1 and curl.exe / wget.exe in 7;
  // curl-style flags (-X, -d, --data) pass through, PowerShell parameters are translated.
  if (kind === 'web') {
    const curlStyle = (name === 'curl' || name === 'wget');
    const native = []; const ps = [];
    for (let i = 0; i < rest.length; i++) {
      if (curlStyle && /^(-[A-Za-z]|--.+)$/.test(rest[i])) { native.push(rest[i]); if (/^-[A-Za-z]$|^--[\w-]+$/.test(rest[i]) && rest[i + 1] !== undefined && !rest[i + 1].startsWith('-')) native.push(rest[++i]); } else ps.push(rest[i]);
    }
    const b = bind(ps, SPECS.web);
    const a = ['curl'];
    if (b.Method || b.CustomMethod) a.push('-X', first(b, 'Method', 'CustomMethod')[0]);
    for (const v of b.Body || []) a.push('-d', v);
    for (const v of b.InFile || []) a.push('-T', v);
    for (const v of b.Form || []) a.push('-F', v);
    for (const v of b.Headers || []) a.push('-H', v);
    for (const v of b.OutFile || []) a.push('-o', v);
    a.push(...native, ...(b.Uri || []), ...b._);
    return out(a);
  }
  if (kind === 'rm') { const b = bind(rest, SPECS.rm); return out(['rm', ...(b.Recurse ? ['-r'] : []), ...(b.Force ? ['-f'] : []), ...first(b, 'Path', 'LiteralPath'), ...b._]); }
  if (kind === 'set') {
    const b = bind(rest, SPECS.tee);
    let targets = first(b, 'Path', 'LiteralPath', 'FilePath');
    if (name === 'out-file' || name === 'tee-object' || name === 'tee') { targets = first(b, 'FilePath', 'Path', 'LiteralPath'); if (!targets.length && b.Value) targets = b.Value; }
    if (name === 'new-item' || name === 'ni') {
      if (b.Name) targets = targets.length ? targets.map((t) => `${t}/${b.Name[0]}`) : b.Name;
      if (/^(directory|junction|symboliclink|hardlink)$/i.test((b.ItemType || [])[0] || '')) return out(['mkdir', ...targets]);
    }
    if (name === 'clear-content' || name === 'clc') return out(['truncate', ...targets]);
    return out(['tee', ...(/^(add-content|ac)$/.test(name) || b.Append ? ['-a'] : []), ...targets]);
  }
  if (kind === 'mv' || kind === 'cp') {
    const b = bind(rest, SPECS.move);
    const src = first(b, 'Path', 'LiteralPath');
    let dst = first(b, 'Destination');
    if (b.NewName) dst = [src[0] && src[0].includes('/') ? `${src[0].replace(/\/[^/]*$/, '')}/${b.NewName[0]}` : b.NewName[0]];
    return out([kind, ...src, ...b._, ...dst]);
  }
  if (kind === 'iex') { const b = bind(rest, SPECS.iex); return depth > 6 ? [] : first(b, 'Command').flatMap((s) => parseInner(s, depth + 1)); }
  if (kind === 'start') {
    const b = bind(rest, SPECS.start);
    const file = first(b, 'FilePath');
    if (!file.length) return [];
    const args = (b.ArgumentList || []).concat(b._).flatMap((x) => tokenize(x).argv);
    const r = [...redirects, ...first(b, 'RedirectStandardOutput', 'RedirectStandardError').map((t) => ({ op: '>', target: t }))];
    return depth > 6 ? [] : translate([file[0], ...args], env, r, depth + 1);
  }
  if (READER.has(name)) return out([READER.get(name), ...rest]);
  // Nested shells.
  if (name === 'powershell' || name === 'pwsh') {
    for (let i = 0; i < rest.length; i++) {
      const a = rest[i];
      if (/^-(c|co|com|comm|comma|comman|command)$/i.test(a)) return depth > 6 ? [] : parseInner(rest.slice(i + 1).join(' '), depth + 1);
      if (/^-(e|ec|en|enc|enco|encod|encode|encoded|encodedc\w*)$/i.test(a)) { try { return depth > 6 ? [] : parseInner(Buffer.from(rest[i + 1] || '', 'base64').toString('utf16le'), depth + 1); } catch { return out(argv); } }
      if (/^-(f|fi|fil|file)$/i.test(a)) return out(argv);
      if (/^-(executionpolicy|ep|ex|ex\w*|windowstyle|w|inputformat|outputformat|configurationname|version|v|workingdirectory|wd|settingsfile|custompipename)$/i.test(a)) { i++; continue; }
      if (a.startsWith('-')) continue;
      return depth > 6 ? [] : parseInner(rest.slice(i).join(' '), depth + 1);
    }
    return out(argv);
  }
  if (name === 'cmd') { const i = rest.findIndex((a) => /^\/[ck]$/i.test(a)); if (i >= 0) return depth > 6 ? [] : parseCommands(rest.slice(i + 1).join(' ')).map((c) => ({ ...c, argv: [exeName(c.argv[0]), ...c.argv.slice(1)] })); }
  if (['bash', 'sh', 'zsh'].includes(name)) { const i = rest.findIndex((a) => /^-[a-z]*c[a-z]*$/.test(a)); if (i >= 0 && rest[i + 1] !== undefined) return depth > 6 ? [] : parseCommands(rest[i + 1]); }
  if (name === 'wsl') {
    let i = 0;
    while (i < rest.length && rest[i].startsWith('-')) { if (/^(-d|--distribution|-u|--user|--cd)$/.test(rest[i])) i++; i++; if (rest[i - 1] === '--' || /^(-e|--exec)$/.test(rest[i - 1])) break; }
    return depth > 6 ? [] : translate(rest.slice(i), env, redirects, depth + 1);
  }
  return out([name, ...rest]);
}

function parseInner(src, depth) {
  const { parts, subs, piped } = split(String(src || ''));
  const out = [];
  const env = {};
  // Paths a pipeline stage hands on: `Get-ChildItem .h-stack | Remove-Item` removes .h-stack's files.
  let handed = [];
  for (const [k, p] of parts.entries()) {
    let { argv, redirects, quotedFirst } = tokenize(p);
    const from = piped[k] ? handed : [];
    handed = quotedFirst ? argv : [];
    // $env:NAME = value carries to the later statements, like an exported variable.
    const asg = /^\$env:([A-Za-z_]\w*)$/i.exec(argv[0] || '');
    if (asg && argv[1] === '=') { env[asg[1].toUpperCase()] = argv.slice(2).join(' '); continue; }
    const m = /^\$env:([A-Za-z_]\w*)=(.*)$/i.exec(argv[0] || '');
    if (m) { env[m[1].toUpperCase()] = m[2]; continue; }
    // $x = <command>, [type]$x = <command>
    if (/^(\[[^\]]+\])*\$[\w:]+$/.test(argv[0] || '') && /^[+\-*/]?=$/.test(argv[1] || '')) argv = argv.slice(2);
    else if (/^(\[[^\]]+\])*\$[\w:]+[+\-*/]?=/.test(argv[0] || '')) { const v = argv[0].replace(/^(\[[^\]]+\])*\$[\w:]+[+\-*/]?=/, ''); argv = v ? [v, ...argv.slice(1)] : argv.slice(1); }
    if (quotedFirst && !redirects.length) continue; // "text" | ... is a value; only & "path" runs a command
    while (argv[0] === '&' || argv[0] === '.') argv = argv.slice(1);
    if (argv.length && KEYWORDS.has(argv[0].toLowerCase())) continue;
    if (argv.length && /^\$/.test(argv[0]) && !redirects.length) continue; // an expression, not a command
    const cmds = translate(argv, { ...env }, redirects, depth);
    const [c] = cmds;
    if (cmds.length === 1 && /^(where-object|where|\?|sort-object|sort|select-object|select)$/.test(c.argv[0])) handed = from;
    if (cmds.length === 1 && ['ls', 'stat', 'cat'].includes(c.argv[0])) { const b = bind(argv.slice(1), PATHS); handed = [...first(b, 'Path', 'LiteralPath'), ...b._]; }
    if (cmds.length === 1 && from.length && ['rm', 'tee', 'truncate'].includes(c.argv[0]) && !c.argv.slice(1).some((x) => !x.startsWith('-'))) c.argv.push(...from);
    out.push(...cmds);
  }
  if (depth < 6) for (const s of subs) out.push(...parseInner(s, depth + 1));
  return out.filter((c) => c.argv.length || c.redirects.length);
}

export function parsePowerShell(src) {
  return parseInner(src, 0);
}
