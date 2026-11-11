// H-Stack mods module (ARCHITECTURE §6.2). One hooks module per plugin, so every mod lives here.
// Security rule (§10.5): no hook here ever returns allow; mods only deny, defer or observe.
//   tool.describe  firewall (HS-033, P0)        agent.spawn  governor (HS-041)
//   prompt.submit  classifier fallback (HS-019, off by default, OD-1)
//   turn.start/step/complete  step budget (HS-038), telemetry (HS-058), announcement (HS-056),
//                  boundary offers (HS-024), unresolved-concern check (HS-040, off by default)
//   ui.render Spinner (HS-056) and Pane (HS-057)   $.clock.every overseer (HS-042, long runs only)
import { scanDescription, neutralise, serverOf } from '../lib/pure/firewall.mjs'
import { classify } from '../lib/pure/classify-rules.mjs'
import { overseerFindings, offerFor, spawnBudget } from '../lib/pure/mod-rules.mjs'

const state = {
  config: { classifier: { fallback: false }, budgets: { spawn: { direct: 0, light: 1, full: 5 } }, models: {}, concerns: true, offers: true, pane: 'auto', long_run: { overseer: true } },
  index: { skills: [] },
  route: {},
  session: '',
  turn: null,
  steps: 0,
  spawned: 0,
  announced: '',
  commits: 0,
  testsPassed: 0,
  edits: 0,
  calls: [],
  tools: {},
  concernAsked: '',
  concernPending: false,
  paneOpen: false,
  pane: { receipts: [], assumptions: [], decisions: [], wishes: [] },
  overseerNoted: '',
}

async function readJson($, path, fallback) {
  try { return JSON.parse(await $.fs.read(path)) } catch { return fallback }
}

async function readJsonl($, path) {
  try { return String(await $.fs.read(path)).split('\n').filter(Boolean).map((l) => { try { return JSON.parse(l) } catch { return null } }).filter(Boolean) } catch { return [] }
}

async function loadState($) {
  try { state.session = String(await $.fs.read('.h-stack/active-session')).trim() } catch { /* no state yet */ }
  const cfg = await readJson($, '.h-stack/config.json', {})
  state.config = { ...state.config, ...cfg, budgets: { ...state.config.budgets, ...(cfg.budgets || {}) } }
  if (state.session) state.route = await readJson($, `.h-stack/sessions/${state.session}/route.json`, {})
}

async function refreshPane($) {
  if (!state.session) return
  const dir = `.h-stack/sessions/${state.session}`
  state.pane.receipts = (await readJsonl($, `${dir}/ledger.jsonl`)).filter((r) => r.kind === 'receipt').slice(-5)
  state.pane.assumptions = (await readJsonl($, `${dir}/assumptions.jsonl`)).slice(-5)
  state.pane.decisions = (await readJsonl($, `${dir}/decisions.jsonl`)).slice(-5)
  state.pane.wishes = (await readJsonl($, '.h-stack/wishlist.jsonl')).slice(-3)
}

async function writeSteps($) {
  if (!state.session || !state.route.prompt_id) return
  try { await $.fs.write(`.h-stack/sessions/${state.session}/steps.json`, JSON.stringify({ prompt_id: state.route.prompt_id, count: state.steps })) } catch { /* observe only */ }
}

async function appendTelemetry($, row) {
  try {
    let prev = ''
    try { prev = String(await $.fs.read('.h-stack/telemetry/mod-turns.jsonl')) } catch { /* first */ }
    const lines = (prev + JSON.stringify(row) + '\n').split('\n').filter(Boolean).slice(-2000)
    await $.fs.write('.h-stack/telemetry/mod-turns.jsonl', lines.join('\n') + '\n')
  } catch { /* never break a turn */ }
}

async function concernCheck($, answer) {
  const r = await $.model.complete({
    model: 'haiku',
    system: 'List each concern, risk or problem the assistant raised in its message, and whether the same message resolves it. Reply with JSON only: {"unresolved": ["..."]}. Empty list if none.',
    prompt: String(answer).slice(0, 6000),
    maxTokens: 300,
    timeoutMs: 15000,
  })
  if (!r.isAnswered) return []
  try { return JSON.parse(String(r.text).match(/\{[\s\S]*\}/)[0]).unresolved || [] } catch { return [] }
}

async function overseerTick($) {
  if (!state.session) return
  const goal = await readJson($, `.h-stack/sessions/${state.session}/goal.json`, null)
  if (!goal) return
  const rows = await readJsonl($, `.h-stack/sessions/${state.session}/ledger.jsonl`)
  const found = overseerFindings(rows, await $.clock.now())
  const key = found.map((f) => f.kind).join(',')
  if (!found.length || key === state.overseerNoted) return
  state.overseerNoted = key
  await $.ui.notice(`H-Stack overseer: ${found.map((f) => f.text).join(' ')}`)
}

export function register(on) {
  on('session.start', async ($, e, next) => {
    await loadState($)
    state.index = await readJson($, new URL('../index.json', import.meta.url).pathname, { skills: [] })
    // HS-042: the timer runs every session but acts only during a long run (a recorded /goal).
    if (!state.config.long_run || state.config.long_run.overseer !== false) $.clock.every(30000, async () => { await overseerTick($) })
    if (state.config.pane === true) { await $.ui.open({ id: 'h-stack', title: 'H-Stack' }); state.paneOpen = true }
    return next(e)
  })

  // HS-033: firewall every MCP tool description before Claude reads it.
  on('tool.describe', async ($, e, next) => {
    const name = e.tool || e.name || ''
    const server = serverOf(name)
    if (!server) return next(e)
    const findings = scanDescription(e.description)
    if (!findings.length) return next(e)
    await $.ui.toast(`H-Stack deferred ${name} from MCP server "${server}": ${findings.map((f) => f.rule).join(', ')}`)
    return { description: neutralise(e.description, findings, server, name), isDeferred: true }
  }).catch(($, e) => (serverOf(e.tool || e.name || '') ? { description: '[H-Stack firewall could not check this MCP tool description, so the tool is deferred.]', isDeferred: true } : { description: e.description }))

  // HS-041: spawn budget by task size; model per role. Resumed runs are not counted.
  on('agent.spawn', async ($, e, next) => {
    if (e.resume) return next(e)
    const size = state.route.size || 'light'
    const verdict = spawnBudget(size, state.spawned, state.config.budgets.spawn)
    if (verdict.deny) return { deny: verdict.deny }
    state.spawned += 1
    const role = e.agentType || e.subagentType || e.type || ''
    const model = (state.config.models || {})[role]
    return model ? next({ ...e, model }) : next(e)
  })

  // HS-019: small-model fallback when the rules found nothing (off unless config.classifier.fallback).
  on('prompt.submit', async ($, e, next) => {
    if (!state.config.classifier || !state.config.classifier.fallback) return next(e)
    const { route } = classify(e.text, state.index, state.route)
    if (route.size === 'direct' || route.skills.length) return next(e)
    const catalogue = state.index.skills.map((s) => `${s.qualified}: ${s.purpose}`).join('\n')
    const r = await $.model.complete({
      model: 'haiku',
      system: [{ text: `Classify the user's request. size: direct (trivial, no process), light, or full (multi-step or ambiguous). decision: act, ask (needs answers first) or stop. skill: at most one from this catalogue, or none.\n${catalogue}\nReply with JSON only: {"size": "direct|light|full", "decision": "act|ask|stop", "skill": "<qualified name or none>", "why": "<short reason>"}`, cache: true }],
      prompt: e.text.slice(0, 4000),
      maxTokens: 80,
      timeoutMs: 8000,
    })
    if (!r.isAnswered) return next(e)
    let pick = null
    try { pick = JSON.parse(String(r.text).match(/\{[\s\S]*\}/)[0]) } catch { return next(e) }
    if (!pick) return next(e)
    const size = ['direct', 'light', 'full'].includes(pick.size) ? pick.size : 'light'
    if (size === 'direct') return next(e)
    const skill = pick.skill && pick.skill !== 'none' && state.index.skills.some((s) => s.qualified === pick.skill) ? pick.skill : null
    const decision = ['act', 'ask', 'stop'].includes(pick.decision) ? pick.decision : 'act'
    if (!skill && decision === 'act') return next(e)
    const parts = [`H-Stack: size=${size} (model fallback).`]
    if (skill) parts.push(`Relevant skill: ${skill} (load with the Skill tool) because ${String(pick.why || '').slice(0, 80)}.`)
    if (decision !== 'act') parts.push(`The request reads as ${decision === 'ask' ? 'needing answers before acting' : 'one to stop on'}; h-stack:clarify covers act/ask/stop.`)
    return next({ ...e, context: [...(e.context || []), parts.join(' ')] })
  })

  on('turn.start', async ($, e, next) => {
    await loadState($)
    state.turn = e.turnId
    state.steps = 0
    state.spawned = 0
    state.commits = 0
    state.testsPassed = 0
    state.edits = 0
    state.calls = []
    state.tools = {}
    // HS-057: the pane opens by itself once a long run (a recorded /goal) is in progress (pane: 'auto').
    if (state.config.pane === 'auto' && !state.paneOpen && state.session && await readJson($, `.h-stack/sessions/${state.session}/goal.json`, null)) {
      try { await $.ui.open({ id: 'h-stack', title: 'H-Stack' }); state.paneOpen = true } catch { /* no pane support */ }
    }
    return next(e)
  })

  on('tool.call', async ($, e, next) => {
    const result = await next(e)
    const input = e.input || e
    if (e.tool) state.tools[e.tool] = (state.tools[e.tool] || 0) + 1
    if (e.tool === 'Edit' || e.tool === 'Write' || e.tool === 'MultiEdit') state.edits += 1
    if (e.tool === 'Bash') {
      const cmd = String(input.command || '')
      state.calls.push(cmd.slice(0, 80))
      const failed = result && (result.isError || /^Exit code [1-9]/.test(String(result.content || result.result || '')))
      if (/\bgit commit\b/.test(cmd) && !failed) state.commits += 1
      if (/\b(test|pytest|jest|vitest|go test|cargo test)\b/.test(cmd) && !failed) state.testsPassed += 1
    }
    return result
  })

  on('turn.step', async function* ($, e, next) {
    const result = yield* next(e)
    if (!e.agentId) { state.steps += 1; await writeSteps($) }
    return result
  })

  on('turn.complete', async ($, e, next) => {
    if (e.agentId) return next(e)
    const u = e.usage || {}
    await appendTelemetry($, { turn: state.turn, prompt_id: state.route.prompt_id || null, size: state.route.size || null, skills: state.route.skills || [], steps: state.steps, input_tokens: u.input_tokens || 0, output_tokens: u.output_tokens || 0, cache_read: u.cache_read_input_tokens || 0, cache_write: u.cache_creation_input_tokens || 0, duration_ms: e.durationMs || 0, edits: state.edits, tools: state.tools, aborted: Boolean(e.isAborted) })
    await refreshPane($)
    $.ui.invalidate('ui.render')
    if (e.isAborted) return next(e)
    // HS-040: once per prompt, and never on the turn that answers H-Stack's own note (no resubmit loop:
    // the resubmitted turn gets a new prompt_id, so the pending flag is what stops a second note).
    if (state.concernPending) state.concernPending = false
    else if (state.config.concerns !== false && state.edits > 0 && state.concernAsked !== state.route.prompt_id && String(e.answer || '').length > 200) {
      state.concernAsked = state.route.prompt_id
      const open = await concernCheck($, e.answer)
      if (open.length) state.concernPending = true
      if (open.length) $.prompt.submit({ text: `H-Stack concern check: the last reply raised ${open.length} point(s) it did not resolve: ${open.slice(0, 3).join('; ')}. Resolve them or say why they don't apply.` })
    }
    const lines = []
    const skills = (state.route.skills || []).join(', ')
    if (skills && skills !== state.announced) { state.announced = skills; lines.push(`H-Stack used ${skills} (${(state.route.rules || [])[0] || 'routing rule'}).`) }
    if (state.config.offers !== false) { const offer = offerFor(state); if (offer) lines.push(offer) }
    return lines.length ? { text: lines.join(' ') } : next(e)
  })

  on('ui.render', { component: 'Spinner' }, async ($, e, next) => {
    const skills = state.route.skills || []
    if (!skills.length) return next(e)
    const suffix = ` · H-Stack · ${state.route.size || 'light'} · ${skills[0].replace('h-stack:', '')}${state.steps ? ` · step ${state.steps}` : ''}`
    return next({ ...e, props: { ...e.props, suffix: (e.props.suffix || '') + suffix } })
  })

  on('ui.render', { component: 'Pane' }, async ($, e, next) => {
    if (e.requestId !== 'h-stack') return next(e)
    const { Box, Text } = $.ui.resolve(e)
    const row = (t) => Text({ wrap: 'truncate' }, t)
    const p = state.pane
    return Box({ flexDirection: 'column' },
      row(`Route: size=${state.route.size || '-'} · ${(state.route.skills || []).join(', ') || 'no skill'}`),
      row(`Receipts: ${p.receipts.map((r) => `${r.id} exit ${r.exit}`).join(', ') || 'none'}`),
      row(`Assumptions: ${p.assumptions.map((a) => `${a.id} ${a.status || ''}`).join(', ') || 'none'}`),
      row(`Decisions: ${p.decisions.map((d) => d.id).join(', ') || 'none'}`),
      row(`Wishlist: ${p.wishes.map((w) => `${w.id} ${w.status || ''}`).join(', ') || 'none'}`))
  })
}
