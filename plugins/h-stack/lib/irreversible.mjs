// HS-030 irreversible-action classifier, HS-034 credential exec, HS-035 scope lock helpers.
// Effect classes: medium (ask with manifest; some need a dry-run receipt) and high (deny).
import { parseCommands, exe, normaliseArgv } from './shell.mjs';

const has = (argv, ...words) => words.every((w) => argv.includes(w));
const sub = (argv, i) => argv[i] || '';

// Each rule: (cmd, ctx) => null | { cls, needsDryRun, target, destination, dry }
const RULES = [
  // Publishing and releases
  (c) => { const e = exe(c); const a = c.argv; if (['npm', 'pnpm', 'yarn', 'bun'].includes(e) && a.includes('publish') && !a.includes('--dry-run')) return { cls: 'publish', target: `${e} publish`, destination: 'package registry', needsDryRun: true, dry: [`${e} publish --dry-run`, `${e} pack`] }; return null; },
  (c) => (exe(c) === 'cargo' && sub(c.argv, 1) === 'publish' && !c.argv.includes('--dry-run') ? { cls: 'publish', target: 'cargo publish', destination: 'crates.io', needsDryRun: true, dry: ['cargo publish --dry-run', 'cargo package'] } : null),
  (c) => (exe(c) === 'twine' && sub(c.argv, 1) === 'upload' ? { cls: 'publish', target: 'twine upload', destination: 'PyPI', needsDryRun: true, dry: ['twine check'] } : null),
  (c) => (['poetry', 'uv', 'hatch', 'flit'].includes(exe(c)) && sub(c.argv, 1) === 'publish' && !c.argv.includes('--dry-run') ? { cls: 'publish', target: `${exe(c)} publish`, destination: 'PyPI', needsDryRun: true, dry: [`${exe(c)} build`, `${exe(c)} publish --dry-run`] } : null),
  (c) => (exe(c) === 'gem' && sub(c.argv, 1) === 'push' ? { cls: 'publish', target: 'gem push', destination: 'rubygems.org', needsDryRun: true, dry: ['gem build'] } : null),
  (c) => (exe(c) === 'docker' && ['push'].includes(sub(c.argv, 1)) ? { cls: 'publish', target: 'docker push', destination: sub(c.argv, 2) || 'registry', needsDryRun: false } : null),
  (c) => (exe(c) === 'gh' && sub(c.argv, 1) === 'release' && ['create', 'delete', 'upload', 'edit'].includes(sub(c.argv, 2)) ? { cls: 'publish', target: `gh release ${sub(c.argv, 2)}`, destination: 'GitHub releases', needsDryRun: false } : null),
  (c) => (exe(c) === 'gh' && sub(c.argv, 1) === 'pr' && sub(c.argv, 2) === 'merge' ? { cls: 'merge', target: 'gh pr merge', destination: `PR ${c.argv.find((x) => /^\d+$/.test(x)) || '(current)'}`, needsDryRun: false } : null),
  // Deploys
  (c) => { const e = exe(c); const a = c.argv;
    if (e === 'vercel' && (a.includes('--prod') || a.includes('promote'))) return { cls: 'deploy', target: 'vercel --prod', destination: 'production', needsDryRun: false };
    if (e === 'netlify' && sub(a, 1) === 'deploy' && a.includes('--prod')) return { cls: 'deploy', target: 'netlify deploy --prod', destination: 'production', needsDryRun: false };
    if (e === 'wrangler' && ['deploy', 'publish'].includes(sub(a, 1)) && !a.includes('--dry-run')) return { cls: 'deploy', target: `wrangler ${sub(a, 1)}`, destination: 'Cloudflare', needsDryRun: true, dry: ['wrangler deploy --dry-run'] };
    if (['fly', 'flyctl'].includes(e) && sub(a, 1) === 'deploy') return { cls: 'deploy', target: 'fly deploy', destination: 'Fly.io', needsDryRun: false };
    if (e === 'firebase' && sub(a, 1) === 'deploy') return { cls: 'deploy', target: 'firebase deploy', destination: 'Firebase', needsDryRun: false };
    if (e === 'heroku' && ['releases:rollback', 'pg:reset', 'apps:destroy'].includes(sub(a, 1))) return { cls: 'deploy', target: `heroku ${sub(a, 1)}`, destination: 'Heroku', needsDryRun: false };
    if (e === 'railway' && sub(a, 1) === 'up') return { cls: 'deploy', target: 'railway up', destination: 'Railway', needsDryRun: false };
    if (e === 'serverless' || e === 'sls') { if (sub(a, 1) === 'deploy' || sub(a, 1) === 'remove') return { cls: 'deploy', target: `${e} ${sub(a, 1)}`, destination: 'cloud', needsDryRun: true, dry: [`${e} package`] }; }
    if (e === 'terraform' && ['apply', 'destroy'].includes(sub(a, 1))) return { cls: sub(a, 1) === 'destroy' ? 'delete-remote' : 'deploy', target: `terraform ${sub(a, 1)}`, destination: 'infrastructure', needsDryRun: true, dry: ['terraform plan'] };
    if (e === 'tofu' && ['apply', 'destroy'].includes(sub(a, 1))) return { cls: 'deploy', target: `tofu ${sub(a, 1)}`, destination: 'infrastructure', needsDryRun: true, dry: ['tofu plan'] };
    if (e === 'pulumi' && ['up', 'destroy', 'update'].includes(sub(a, 1))) return { cls: 'deploy', target: `pulumi ${sub(a, 1)}`, destination: 'infrastructure', needsDryRun: true, dry: ['pulumi preview'] };
    if (e === 'kubectl' && ['apply', 'delete', 'replace', 'patch', 'scale', 'rollout', 'drain'].includes(sub(a, 1)) && !a.some((x) => x.startsWith('--dry-run'))) return { cls: sub(a, 1) === 'delete' ? 'delete-remote' : 'deploy', target: `kubectl ${sub(a, 1)}`, destination: (a.find((x) => x.startsWith('--context=')) || 'current context'), needsDryRun: true, dry: ['kubectl diff', `kubectl ${sub(a, 1)} --dry-run`, 'kubectl get'] };
    if (e === 'helm' && ['install', 'upgrade', 'uninstall', 'rollback', 'delete'].includes(sub(a, 1)) && !a.includes('--dry-run')) return { cls: 'deploy', target: `helm ${sub(a, 1)}`, destination: 'cluster', needsDryRun: true, dry: ['helm diff', `helm ${sub(a, 1)} --dry-run`, 'helm template'] };
    if (e === 'eb' && ['deploy', 'terminate'].includes(sub(a, 1))) return { cls: 'deploy', target: `eb ${sub(a, 1)}`, destination: 'Elastic Beanstalk', needsDryRun: false };
    return null; },
  // Remote deletes
  (c) => { const e = exe(c); const a = c.argv;
    if (e === 'aws' && (a.some((x) => /^(delete|remove|terminate|deregister|purge)-/.test(x)) || (sub(a, 1) === 's3' && ['rm', 'rb'].includes(sub(a, 2))) || (sub(a, 1) === 's3' && sub(a, 2) === 'sync' && a.includes('--delete')))) return { cls: 'delete-remote', target: `aws ${a.slice(1, 3).join(' ')}`, destination: 'AWS', needsDryRun: true, dry: ['aws s3 ls', 'aws ... describe-', 'aws ... list-', '--dryrun'] };
    if (e === 'gcloud' && a.includes('delete')) return { cls: 'delete-remote', target: `gcloud ${a.slice(1, 4).join(' ')}`, destination: 'Google Cloud', needsDryRun: true, dry: ['gcloud ... list', 'gcloud ... describe'] };
    if (e === 'az' && a.includes('delete')) return { cls: 'delete-remote', target: `az ${a.slice(1, 3).join(' ')}`, destination: 'Azure', needsDryRun: true, dry: ['az ... list', 'az ... show'] };
    if (e === 'gsutil' && ['rm', 'rb'].includes(sub(a, 1))) return { cls: 'delete-remote', target: `gsutil ${sub(a, 1)}`, destination: 'GCS', needsDryRun: true, dry: ['gsutil ls'] };
    if (e === 'gh' && sub(a, 1) === 'repo' && sub(a, 2) === 'delete') return { cls: 'delete-remote', target: 'gh repo delete', destination: sub(a, 3) || 'repo', needsDryRun: false };
    if (e === 'gh' && sub(a, 1) === 'api' && a.some((x, i) => (x === '-X' || x === '--method') && /^(DELETE|PUT|PATCH|POST)$/i.test(a[i + 1] || ''))) return { cls: 'remote-write', target: 'gh api write', destination: a.find((x) => x.startsWith('/') || x.startsWith('repos/')) || 'GitHub API', needsDryRun: false };
    if (['curl', 'http', 'httpie', 'xh'].includes(e) && a.some((x, i) => (x === '-X' || x === '--request') && /^DELETE$/i.test(a[i + 1] || ''))) return { cls: 'delete-remote', target: `${e} DELETE`, destination: a.find((x) => /^https?:\/\//.test(x)) || 'remote', needsDryRun: true, dry: [`${e} GET`] };
    if (e === 'git' && sub(a, 1) === 'push' && a.some((x) => x === '--delete' || x === '-d' || /^:[^/]/.test(x))) return { cls: 'delete-remote', target: 'git push --delete', destination: 'remote branch', needsDryRun: false };
    return null; },
  // Databases
  (c, ctx) => { const e = exe(c); const a = c.argv; const joined = a.join(' ');
    const prodEnv = /prod/i.test(JSON.stringify(c.env || {})) || /prod/i.test(joined);
    if (['dropdb'].includes(e)) return { cls: 'db', target: 'dropdb', destination: a[a.length - 1], needsDryRun: false };
    if (['psql', 'mysql', 'sqlite3', 'mongosh', 'mongo', 'redis-cli', 'clickhouse-client'].includes(e) && /\b(drop\s+(table|database|schema|collection)|truncate\s+|delete\s+from|flushall|flushdb|dropDatabase)\b/i.test(joined)) {
      const local = /\b(localhost|127\.0\.0\.1|::1)\b/.test(joined) || (!/(-h|--host)\b/.test(joined) && e === 'sqlite3');
      if (!local || prodEnv) return { cls: 'db', target: `${e} destructive SQL`, destination: (a.find((x, i) => a[i - 1] === '-h' || a[i - 1] === '--host') || 'database'), needsDryRun: true, dry: ['SELECT count', 'BEGIN; … ROLLBACK'] };
    }
    if ((e === 'prisma' || (e === 'npx' && a[1] === 'prisma')) && /migrate (deploy|reset)|db push --force-reset/.test(joined)) return { cls: 'db', target: 'prisma migrate deploy/reset', destination: 'DATABASE_URL', needsDryRun: true, dry: ['prisma migrate status', 'prisma migrate diff'] };
    if (/\b(rails|rake)\b/.test(e) && /db:(drop|reset|migrate|rollback)/.test(joined) && prodEnv) return { cls: 'db', target: 'rails db task (production)', destination: 'production DB', needsDryRun: true, dry: ['db:migrate:status'] };
    if (e === 'alembic' && ['upgrade', 'downgrade'].includes(sub(a, 1)) && prodEnv) return { cls: 'db', target: `alembic ${sub(a, 1)}`, destination: 'production DB', needsDryRun: true, dry: ['alembic upgrade --sql', 'alembic current'] };
    if ((e === 'python' || e === 'python3') && a.includes('manage.py') && /\b(flush|migrate)\b/.test(joined) && prodEnv) return { cls: 'db', target: 'manage.py migrate/flush (production)', destination: 'production DB', needsDryRun: true, dry: ['showmigrations', 'sqlmigrate'] };
    void ctx; return null; },
  // Messages
  (c) => { const e = exe(c); const a = c.argv;
    if (e === 'gh' && ['issue', 'pr'].includes(sub(a, 1)) && ['comment', 'review', 'create', 'close', 'edit', 'reopen', 'lock'].includes(sub(a, 2))) return { cls: 'send', target: `gh ${sub(a, 1)} ${sub(a, 2)}`, destination: `${sub(a, 1)} ${a.find((x, i) => i > 2 && /^\d+$/.test(x)) || '(new/current)'}`, needsDryRun: false, number: a.find((x, i) => i > 2 && /^\d+$/.test(x)) || null };
    if (['sendmail', 'mail', 'mutt', 'msmtp'].includes(e)) return { cls: 'send', target: e, destination: a.find((x) => x.includes('@')) || 'email', needsDryRun: false };
    if (e === 'curl' && a.some((x) => /hooks\.slack\.com|discord(app)?\.com\/api\/webhooks|api\.telegram\.org|outlook\.office\.com\/webhook/.test(x))) return { cls: 'send', target: 'webhook post', destination: 'chat webhook', needsDryRun: false };
    return null; },
  // Git pushes
  (c, ctx) => { const e = exe(c); const a = c.argv;
    if (e !== 'git' || sub(a, 1) !== 'push') return null;
    if (a.some((x) => x === '--force' || x === '-f' || x.startsWith('--force-with-lease') || /^\+/.test(x) || x === '--mirror')) return { cls: 'force-push', target: 'git push --force', destination: a.slice(2).filter((x) => !x.startsWith('-')).join(' ') || 'upstream', needsDryRun: false };
    const def = ctx.defaultBranch || 'main';
    const refs = a.slice(2).filter((x) => !x.startsWith('-'));
    const pushesDefault = refs.some((r) => r === def || r.endsWith(`:${def}`) || r === `HEAD:${def}`) || (refs.length <= 1 && ctx.currentBranch === def);
    if (pushesDefault) return { cls: 'push-default', target: `git push to ${def}`, destination: refs[0] || 'origin', needsDryRun: false };
    return null; },
];

// Secrets to the network: always denied (high effect, D10).
const NET = new Set(['curl', 'wget', 'nc', 'ncat', 'netcat', 'http', 'httpie', 'xh', 'scp', 'rsync', 'ssh', 'sftp', 'ftp', 'telnet', 'socat']);
const SECRET_SRC = /(\$\{?(AWS_SECRET_ACCESS_KEY|AWS_SESSION_TOKEN|GITHUB_TOKEN|GH_TOKEN|ANTHROPIC_API_KEY|OPENAI_API_KEY|NPM_TOKEN|[A-Z_]*(SECRET|PASSWORD|PRIVATE_KEY|API_KEY)[A-Z_]*)\}?|~\/\.ssh\/id_|\.ssh\/id_[a-z0-9]+|\.aws\/credentials|\.netrc|\.npmrc|\.pypirc|\.docker\/config\.json|\bprintenv\b|\benv\s*\||\/proc\/self\/environ|\.env\b)/;

const CRED_PRINTERS = [/^gh auth token\b/, /^gh auth status .*--show-token/, /^aws (configure get|configure export-credentials|sts get-session-token|ecr get-login-password)\b/, /^gcloud auth (print-access-token|print-identity-token|application-default print-access-token)\b/, /^az account get-access-token\b/, /^(security) find-(generic|internet)-password\b/, /^op (read|item get)\b/, /^vault (read|kv get)\b/, /^(cat|head|tail|less|base64|xxd) .*(\.config\/gh\/hosts\.yml|\.git-credentials|\.kube\/config)\b/, /^git credential fill\b/, /^npm token\b/];

export function classifyBash(command, ctx = {}) {
  const cmds = parseCommands(command);
  const findings = [];
  const text = String(command);
  const usesNet = cmds.some((c) => NET.has(exe(c)));
  // Match the de-quoted parsed tokens as well as the raw text (self-audit F8: `.e""nv`), and treat
  // commands that print a credential as secret sources (`$(gh auth token)`).
  const tokens = cmds.map((c) => c.argv.join(' ')).join(' ; ');
  const printsCred = cmds.some((c) => CRED_PRINTERS.some((re) => re.test(`${exe(c)} ${c.argv.slice(1).join(' ')}`)));
  if (usesNet && (SECRET_SRC.test(text) || SECRET_SRC.test(tokens) || printsCred)) {
    findings.push({ cls: 'exfiltration', high: true, target: 'secret to network', destination: (text.match(/https?:\/\/[^\s'"]+/) || ['remote'])[0] });
  }
  for (const raw of cmds) {
    const c = { ...raw, argv: normaliseArgv(raw.argv) };
    for (const r of RULES) {
      const hit = r(c, ctx);
      if (hit) { findings.push({ ...hit, argv: c.argv }); break; }
    }
  }
  return findings;
}

// HS-034: credential-bearing commands run through project-controlled executables.
const CRED_HINT = /\b(login|auth|token|credential|secret|publish|deploy|release|whoami|configure)\b/i;
export function credentialExec(command) {
  const out = [];
  for (const c of parseCommands(command)) {
    const a = c.argv; const e = exe(c);
    const viaProject = (e === 'npx' && !a.includes('--no-install')) || (e === 'pnpm' && ['exec', 'dlx'].includes(a[1])) || (['npm', 'yarn', 'pnpm', 'bun'].includes(e) && a[1] === 'run') || /node_modules\/\.bin\//.test(a[0] || '') || (e === 'bunx') || (e === 'yarn' && a[1] === 'dlx');
    if (viaProject && CRED_HINT.test(a.join(' '))) out.push(a.slice(0, 4).join(' '));
  }
  return out;
}

// HS-035: gh issue/pr write target number.
export function ghTargetNumbers(command) {
  const nums = [];
  for (const c of parseCommands(command)) {
    const a = c.argv;
    if (exe(c) !== 'gh') continue;
    if (['issue', 'pr'].includes(a[1]) && ['comment', 'review', 'close', 'edit', 'merge', 'reopen', 'lock', 'ready'].includes(a[2])) {
      const n = a.slice(3).find((x) => /^#?\d+$/.test(x));
      if (n) nums.push(n.replace('#', ''));
    }
    if (a[1] === 'api') {
      const p = a.find((x) => /\/(issues|pulls)\/\d+/.test(x));
      const isWrite = a.some((x, i) => (x === '-X' || x === '--method') && !/^GET$/i.test(a[i + 1] || '')) || a.some((x) => x === '-f' || x === '-F' || x === '--field' || x === '--raw-field' || x === '--input');
      if (p && isWrite) nums.push(p.match(/\/(issues|pulls)\/(\d+)/)[2]);
    }
  }
  return nums;
}

export function isDryRunLike(cmd) {
  return /(--dry-run|--dryrun|\bplan\b|\bpreview\b|\bdiff\b|\bpack\b|\btemplate\b|\bstatus\b|\b(list|ls|get|describe|show)\b|--check\b|\bcheck\b|\bbuild\b|--sql\b|\bshowmigrations\b|\bsqlmigrate\b|\bcount\b|\bROLLBACK\b)/i.test(cmd);
}

export function manifest(f) {
  return `effect=${f.cls}; executable=${(f.argv || [])[0] || f.target}; target=${f.target}; destination=${f.destination}`;
}
