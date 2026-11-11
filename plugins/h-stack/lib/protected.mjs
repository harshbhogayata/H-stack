// HS-029 protected checkers and paths. Native permission rules carry the main load
// (proposed by scripts/setup.mjs, OD-4); this list also drives the Bash redirect check.
import { matchesAny } from './core.mjs';
import { TEST_CONFIG_GLOBS } from './tests.mjs';

export const PROTECTED_GLOBS = [
  '.github/workflows/**', '.github/CODEOWNERS', 'CODEOWNERS', 'docs/CODEOWNERS', '.gitlab-ci.yml', '.circleci/**', 'azure-pipelines.yml', 'Jenkinsfile', 'buildkite/**', '.buildkite/**',
  '.claude/settings.json', '.claude/settings.local.json', '.claude/hooks/**', '.mcp.json', '.claude/agents/**',
  '.husky/**', '.pre-commit-config.yaml', 'lefthook.yml',
  ...TEST_CONFIG_GLOBS,
];
export const STATE_GLOB = '.h-stack/**';

export function protectedKind(rel, config) {
  if (matchesAny(rel, [STATE_GLOB]) && !/^\.h-stack\/config\.json$/.test(rel)) return 'state';
  if (matchesAny(rel, [...PROTECTED_GLOBS, ...((config && config.protected && config.protected.extra) || [])])) return 'checker';
  return null;
}

// Native permission rules proposed at setup (OD-4). Shown to the user before writing.
export function proposedPermissionRules() {
  return {
    ask: [
      'Edit(.github/workflows/**)', 'Write(.github/workflows/**)', 'Edit(**/CODEOWNERS)', 'Write(**/CODEOWNERS)',
      'Edit(.claude/settings*.json)', 'Write(.claude/settings*.json)', 'Edit(.claude/hooks/**)', 'Write(.claude/hooks/**)',
      'Edit(.mcp.json)', 'Write(.mcp.json)',
      'Edit(**/jest.config.*)', 'Edit(**/vitest.config.*)', 'Edit(**/pytest.ini)', 'Edit(**/.coveragerc)', 'Edit(**/codecov.yml)',
      'Bash(npm publish:*)', 'Bash(gh pr merge:*)', 'Bash(git push --force:*)',
    ],
    deny: [
      'Edit(.h-stack/sessions/**)', 'Write(.h-stack/sessions/**)', 'Edit(.h-stack/telemetry/**)', 'Write(.h-stack/telemetry/**)',
      'Edit(.h-stack/*.jsonl)', 'Write(.h-stack/*.jsonl)',
      'Read(~/.ssh/**)', 'Read(~/.aws/**)', 'Read(**/.env)', 'Read(**/.env.*)',
    ],
    allow: ['Bash(${CLAUDE_PLUGIN_ROOT}/bin/hs:*)'],
  };
}
