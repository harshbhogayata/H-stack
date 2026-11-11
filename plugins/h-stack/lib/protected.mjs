// HS-029 protected checkers and paths. Native permission rules carry the main load
// (proposed by scripts/setup.mjs, OD-4); this list also drives the Bash redirect check.
import { matchesAny } from './core.mjs';
import { TEST_CONFIG_GLOBS } from './tests.mjs';

export const PROTECTED_GLOBS = [
  '.github/workflows/**', '.github/CODEOWNERS', 'CODEOWNERS', 'docs/CODEOWNERS', '.gitlab-ci.yml', '.circleci/**', 'azure-pipelines.yml', 'Jenkinsfile', 'buildkite/**', '.buildkite/**',
  '.claude/settings.json', '.claude/settings.local.json', '.claude/hooks/**', '.mcp.json', '.claude/agents/**',
  '.claude/rules/**', 'CLAUDE.md', '.claude/CLAUDE.md', 'CLAUDE.local.md', '.h-stack/config.json',
  '.husky/**', '.pre-commit-config.yaml', 'lefthook.yml',
  ...TEST_CONFIG_GLOBS,
];
export const STATE_GLOB = '.h-stack/**';

export function protectedKind(rel, config) {
  // config.json is policy: the agent may propose a change, the user approves it (self-audit F3).
  if (/^\.h-stack\/config\.json$/.test(rel)) return 'checker';
  if (matchesAny(rel, [STATE_GLOB])) return 'state';
  if (matchesAny(rel, [...PROTECTED_GLOBS, ...((config && config.protected && config.protected.extra) || [])])) return 'checker';
  return null;
}

// A checker the user named in this turn's own prompt is approved for this turn: the prompt is trusted
// (T1), and asking again would block the very edit the user requested (measured: CLAUDE.md requests
// failed 3/3 in headless runs). Matched by full relative path or by file name.
export function namedInPrompt(rel, route) {
  const named = (route && route.prompt_paths) || [];
  const base = rel.split('/').pop().toLowerCase();
  return named.some((p) => { const q = String(p).toLowerCase().replace(/^\.\//, ''); return q === rel.toLowerCase() || (!q.includes('/') && q === base); });
}

// Native permission rules proposed at setup (OD-4). Shown to the user before writing.
export function proposedPermissionRules() {
  return {
    ask: [
      'Edit(.github/workflows/**)', 'Write(.github/workflows/**)', 'Edit(**/CODEOWNERS)', 'Write(**/CODEOWNERS)',
      'Edit(.claude/settings*.json)', 'Write(.claude/settings*.json)', 'Edit(.claude/hooks/**)', 'Write(.claude/hooks/**)',
      'Edit(.mcp.json)', 'Write(.mcp.json)', 'Edit(.h-stack/config.json)', 'Write(.h-stack/config.json)',
      'Edit(.claude/rules/**)', 'Write(.claude/rules/**)', 'Edit(CLAUDE.md)', 'Write(CLAUDE.md)',
      'Edit(**/jest.config.*)', 'Edit(**/vitest.config.*)', 'Edit(**/pytest.ini)', 'Edit(**/.coveragerc)', 'Edit(**/codecov.yml)',
      'Bash(npm publish:*)', 'Bash(gh pr merge:*)', 'Bash(git push --force:*)',
    ],
    deny: [
      'Edit(.h-stack/sessions/**)', 'Write(.h-stack/sessions/**)', 'Edit(.h-stack/telemetry/**)', 'Write(.h-stack/telemetry/**)',
      'Edit(.h-stack/*.jsonl)', 'Write(.h-stack/*.jsonl)',
      'Read(~/.ssh/**)', 'Read(~/.aws/**)', 'Read(**/.env)', 'Read(**/.env.*)',
    ],
    allow: ['Bash(hs:*)'],
  };
}
