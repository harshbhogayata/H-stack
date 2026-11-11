// HS-032 untrusted-content taint. Writer: hooks/taint.mjs. Readers: gate-bash, gate-mcp, gate-fetch.
import path from 'node:path';
import { readJsonl, sessionDir, sha } from './core.mjs';

export function extractValues(text) {
  const vals = [];
  const s = String(text || '').slice(0, 400000);
  for (const m of s.matchAll(/https?:\/\/[^\s'"<>)\]]+/g)) {
    vals.push({ kind: 'url', value: m[0] });
    try { vals.push({ kind: 'host', value: new URL(m[0]).host }); } catch { /* */ }
  }
  for (const m of s.matchAll(/\b[\w.+-]+@[\w-]+\.[a-z]{2,}(?:\.[a-z]{2,})?\b/gi)) vals.push({ kind: 'email', value: m[0] });
  for (const m of s.matchAll(/(?:^|\s)(\/(?:etc|home|root|var|Users|tmp)\/[\w./-]+|~\/[\w./-]+)/g)) vals.push({ kind: 'path', value: m[1] });
  return vals;
}

export function taintedIn(proj, sid, text, trusted = []) {
  const rows = readJsonl(path.join(sessionDir(proj, sid), 'taint.jsonl'));
  if (!rows.length) return { any: false, hits: [] };
  const set = new Set(rows.map((r) => r.value_hash));
  const trust = new Set(trusted);
  const hits = [];
  for (const v of extractValues(text)) {
    const h = sha(v.value, 16);
    if (set.has(h) && !trust.has(h)) hits.push(`${v.kind} ${v.value.slice(0, 60)}`);
  }
  return { any: true, hits: [...new Set(hits)] };
}

export function privateDestination(url) {
  let host;
  try { host = new URL(url).hostname.replace(/^\[|\]$/g, '').toLowerCase(); } catch { return null; }
  // Self-audit F6: IPv4-mapped (::ffff:a9fe:a9fe) and NAT64 (64:ff9b::) IPv6 forms of IPv4 hosts.
  const mapped = host.match(/^(?:::ffff:|64:ff9b::)(?:(\d+\.\d+\.\d+\.\d+)|([0-9a-f]{1,4}):([0-9a-f]{1,4}))$/);
  if (mapped) host = mapped[1] || [parseInt(mapped[2], 16) >> 8, parseInt(mapped[2], 16) & 255, parseInt(mapped[3], 16) >> 8, parseInt(mapped[3], 16) & 255].join('.');
  if (/^(localhost|.*\.localhost|.*\.local|.*\.internal|metadata\.google\.internal|metadata)$/i.test(host)) return `${host} (local or metadata host)`;
  if (/^127\.|^0\.0\.0\.0$|^::1$|^::$/.test(host)) return `${host} (loopback)`;
  if (/^10\.|^192\.168\.|^172\.(1[6-9]|2\d|3[01])\.|^fc|^fd|^fe80:/i.test(host)) return `${host} (private network)`;
  if (/^169\.254\.|^100\.100\.100\.200$|^fd00:ec2::254$/.test(host)) return `${host} (cloud metadata)`;
  return null;
}
