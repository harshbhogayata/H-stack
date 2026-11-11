#!/usr/bin/env node
// PreToolUse(mcp__.*): send/post/merge/delete tools are irreversible (HS-030); argument taint (HS-032);
// scope lock on issue/PR numbers (HS-035). FAILURE_MODE=closed
import path from 'node:path';
import { runHook, projectDir, sessionDir, readJson, loadConfig, refusal, preDecision, sha, appendLine } from '../lib/core.mjs';
import { taintedIn } from '../lib/taint.mjs';
import { logTool } from '../lib/telemetry.mjs';

const SEND = /(^|_)(send|post|reply|forward|publish|create_comment|add_comment|add_issue_comment|comment|merge|delete|remove|trash|archive|close|transfer|invite|deploy|release|create_pull_request|create_issue|update_issue|push|write_file|create_or_update_file|push_files|run_workflow|actions_run_trigger)(_|$)/i;
const WRITE_VERBS = /(^|_)(write|update|create|submit|edit|set|add|insert|upsert|put|patch|execute|run|trigger|cancel|approve|rotate|enable|disable|upload|move|rename|assign|label|unlabel|mark|retry|resolve|unresolve|fork|request|apply|grant|revoke|reset|restore|untrash|start|stop|interrupt|unarchive)(_|$)/i;
const READ = /^(get|list|read|search|find|fetch|view|query|describe|show|status|check|scrape|crawl|map|parse|retrieve|lookup|inspect|count|preview|summari[sz]e|extract|browse|download|answers|guide|select|explore)$/i;
// Self-audit F9: `delete-monitor`, `sendMessage`, `issue_write` must split the same as `delete_monitor`.
export const words = (name) => name.replace(/([a-z0-9])([A-Z])/g, '$1_$2').replace(/[-.\s]+/g, '_').toLowerCase();

export function decide(input, proj) {
  const tool = String(input.tool_name || '');
  const action = tool.split('__').slice(2).join('__') || tool;
  const sid = input.session_id || 'no-session';
  const dir = sessionDir(proj, sid);
  const route = readJson(path.join(dir, 'route.json'), {});
  const config = loadConfig(proj);
  const args = JSON.stringify(input.tool_input || {});
  const asks = [];
  const act = words(action);
  // A send/write verb anywhere means a write; otherwise a read verb anywhere means a read;
  // a name with neither is unknown and asks, because the gate cannot tell (fail toward asking).
  const isWrite = SEND.test(act) || WRITE_VERBS.test(act);
  const isRead = act.split('_').some((w) => READ.test(w));
  const writes = isWrite || !isRead;
  if (writes) {
    const s = sha(`${tool}:${args}`, 16);
    if (!(config.irreversible?.allowlist || []).includes(s)) {
      asks.push(refusal('irreversible-gate', `effect=send/write; tool=${tool}; arguments=${args.slice(0, 160)}`, 'the user approves this exact call; changed arguments ask again'));
      appendLine(path.join(dir, 'approvals.jsonl'), { cmd_sha: s, manifest: `mcp ${tool}`, ts: Date.now() }, proj);
    }
    const t = taintedIn(proj, sid, args, route.trusted_values || []);
    if (t.hits.length) asks.push(refusal('argument-taint', `arguments contain ${t.hits.slice(0, 2).join(', ')} seen only in untrusted content`, 'the user confirms these values'));
    const ti = input.tool_input || {};
    const num = ti.issue_number ?? ti.pull_number ?? ti.pullNumber ?? ti.issueNumber ?? ti.number;
    const scope = route.scope_numbers || [];
    if (num != null && scope.length && !scope.includes(String(num))) asks.push(refusal('scope-lock', `this writes to #${num}, but the request named ${scope.map((x) => '#' + x).join(', ')}`, 'confirm the target number with the user'));
  }
  for (const a of asks) logTool(proj, { tool, rule: a.split(':')[0], decision: 'ask' });
  return asks.length ? preDecision('ask', asks.join(' ')) : null;
}
if (import.meta.url === `file://${process.argv[1]}`) await runHook('gate-mcp', 'closed', async (i) => decide(i, projectDir(i)));
