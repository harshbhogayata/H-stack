// Small YAML subset parser for SKILL.md / agent frontmatter (zero dependencies).
// Supports: nested maps by indentation, block lists, flow lists [a, b], flow maps {a: b},
// quoted and plain scalars, numbers, booleans, null, and > / | block scalars.

function unquoteDouble(s) {
  let out = '';
  const map = { n: '\n', t: '\t', r: '\r', '"': '"', '\\': '\\', '/': '/', b: '\b', f: '\f', 0: '\0' };
  for (let i = 1; i < s.length - 1; i++) {
    const c = s[i];
    if (c !== '\\') { out += c; continue; }
    const n = s[++i];
    if (n === 'u') { out += String.fromCharCode(parseInt(s.slice(i + 1, i + 5), 16)); i += 4; }
    else if (n in map) out += map[n];
    else out += '\\' + n;
  }
  return out;
}

function parseScalar(raw) {
  const s = raw.trim();
  if (s === '') return '';
  if (s.startsWith('"')) return unquoteDouble(s);
  if (s.startsWith("'")) return s.slice(1, -1).replace(/''/g, "'");
  if (s.startsWith('[')) return parseFlow(s);
  if (s.startsWith('{')) return parseFlow(s);
  if (s === 'true') return true;
  if (s === 'false') return false;
  if (s === 'null' || s === '~') return null;
  if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s);
  return s;
}

function splitFlow(inner) {
  const out = [];
  let depth = 0; let q = null; let cur = '';
  for (let i = 0; i < inner.length; i++) {
    const c = inner[i];
    if (q) { cur += c; if (c === '\\' && q === '"') { cur += inner[++i]; continue; } if (c === q) q = null; continue; }
    if (c === '"' || c === "'") { q = c; cur += c; continue; }
    if (c === '[' || c === '{') depth++;
    if (c === ']' || c === '}') depth--;
    if (c === ',' && depth === 0) { out.push(cur); cur = ''; continue; }
    cur += c;
  }
  if (cur.trim()) out.push(cur);
  return out;
}

function parseFlow(s) {
  const t = s.trim();
  if (t.startsWith('[')) return splitFlow(t.slice(1, -1)).map((x) => parseScalar(x));
  const obj = {};
  for (const part of splitFlow(t.slice(1, -1))) {
    const idx = findColon(part);
    if (idx < 0) continue;
    obj[unquoteKey(part.slice(0, idx).trim())] = parseScalar(part.slice(idx + 1));
  }
  return obj;
}

function findColon(line) {
  let q = null; let depth = 0;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) { if (c === q) q = null; continue; }
    if (c === '"' || c === "'") { q = c; continue; }
    if (c === '[' || c === '{') depth++;
    if (c === ']' || c === '}') depth--;
    if (c === ':' && depth === 0 && (i + 1 === line.length || line[i + 1] === ' ')) return i;
  }
  return -1;
}
const unquoteKey = (k) => (k.startsWith('"') || k.startsWith("'") ? k.slice(1, -1) : k);
const stripComment = (line) => {
  let q = null;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) { if (c === q) q = null; continue; }
    if (c === '"' || c === "'") { q = c; continue; }
    if (c === '#' && (i === 0 || line[i - 1] === ' ')) return line.slice(0, i).replace(/\s+$/, '');
  }
  return line;
};

export function parseYaml(text) {
  const lines = text.split('\n');
  let i = 0;
  const indentOf = (l) => l.match(/^ */)[0].length;
  const skip = () => { while (i < lines.length && (stripComment(lines[i]).trim() === '')) i++; };

  function block(indent) {
    skip();
    if (i >= lines.length) return null;
    const first = stripComment(lines[i]);
    if (first.trim().startsWith('- ') || first.trim() === '-') return list(indentOf(first));
    return map(indentOf(first));
  }
  function blockScalar(style, indent) {
    const out = [];
    while (i < lines.length) {
      const l = lines[i];
      if (l.trim() === '') { out.push(''); i++; continue; }
      if (indentOf(l) <= indent) break;
      out.push(l);
      i++;
    }
    while (out.length && out[out.length - 1] === '') out.pop();
    const min = Math.min(...out.filter((x) => x).map(indentOf));
    const body = out.map((x) => x.slice(min));
    if (style.startsWith('|')) return body.join('\n') + '\n';
    return body.join('\n').replace(/([^\n])\n(?=[^\n])/g, '$1 ').trim() + (style.endsWith('-') ? '' : '');
  }
  function value(rest, indent) {
    const r = rest.trim();
    if (r === '|' || r === '>' || r === '|-' || r === '>-' || r === '>+' || r === '|+') return blockScalar(r, indent);
    if (r === '') {
      skip();
      if (i < lines.length && indentOf(lines[i]) > indent) return block(indentOf(lines[i]));
      if (i < lines.length && indentOf(lines[i]) === indent && stripComment(lines[i]).trim().startsWith('- ')) return list(indent);
      return null;
    }
    return parseScalar(r);
  }
  function map(indent) {
    const obj = {};
    while (i < lines.length) {
      skip();
      if (i >= lines.length) break;
      const line = stripComment(lines[i]);
      const ind = indentOf(line);
      if (ind < indent) break;
      if (ind > indent) throw new Error(`yaml: unexpected indent at line ${i + 1}: ${line}`);
      if (line.trim().startsWith('- ')) break;
      const idx = findColon(line);
      if (idx < 0) throw new Error(`yaml: expected key at line ${i + 1}: ${line}`);
      const key = unquoteKey(line.slice(0, idx).trim());
      i++;
      obj[key] = value(line.slice(idx + 1), indent);
    }
    return obj;
  }
  function list(indent) {
    const arr = [];
    while (i < lines.length) {
      skip();
      if (i >= lines.length) break;
      const line = stripComment(lines[i]);
      const ind = indentOf(line);
      if (ind !== indent || !(line.trim().startsWith('- ') || line.trim() === '-')) break;
      const rest = line.trim().slice(1).trim();
      if (rest === '') { i++; arr.push(block(indent + 2)); continue; }
      const idx = findColon(rest);
      if (idx >= 0 && !rest.startsWith('"') && !rest.startsWith("'") && !rest.startsWith('[') && !rest.startsWith('{')) {
        // inline map item: "- key: value" with following keys at indent+2
        lines[i] = ' '.repeat(indent + 2) + rest;
        arr.push(map(indent + 2));
        continue;
      }
      i++;
      arr.push(parseScalar(rest));
    }
    return arr;
  }
  return block(0) || {};
}

export function splitFrontmatter(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { data: null, body: md, raw: '' };
  return { data: parseYaml(m[1]), body: m[2], raw: m[1] };
}
