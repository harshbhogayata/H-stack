// Test-file detection (HS-028). Globs auto-detected from the project; config overrides.
import fs from 'node:fs';
import path from 'node:path';
import { matchesAny, readJson } from './core.mjs';

export const DEFAULT_TEST_GLOBS = [
  '**/test/**', '**/tests/**', '**/__tests__/**', '**/spec/**', '**/e2e/**',
  '**/*.test.*', '**/*.spec.*', '**/*_test.go', '**/test_*.py', '**/*_test.py',
  '**/*Test.java', '**/*Tests.cs', '**/*_spec.rb', '**/conftest.py',
];
export const TEST_CONFIG_GLOBS = [
  '**/jest.config.*', '**/vitest.config.*', '**/vitest.workspace.*', '**/playwright.config.*', '**/cypress.config.*',
  '**/karma.conf.*', '**/.mocharc*', '**/pytest.ini', '**/tox.ini', '**/.coveragerc', '**/codecov.yml', '**/.nycrc*',
  '**/phpunit.xml*', '**/setup.cfg',
];

export function testGlobs(proj, config) {
  if (config?.tests?.globs?.length) return config.tests.globs;
  const globs = [...DEFAULT_TEST_GLOBS];
  const pkg = readJson(path.join(proj, 'package.json'), null);
  const jestRoots = pkg?.jest?.roots || pkg?.jest?.testMatch;
  if (Array.isArray(jestRoots)) for (const r of jestRoots) globs.push(String(r).replace(/^<rootDir>\//, ''));
  try {
    const py = fs.readFileSync(path.join(proj, 'pyproject.toml'), 'utf8');
    const m = py.match(/testpaths\s*=\s*\[([^\]]*)\]/);
    if (m) for (const p of m[1].split(',')) { const s = p.trim().replace(/["']/g, ''); if (s) globs.push(`${s}/**`); }
  } catch { /* none */ }
  return globs;
}

export function isTestPath(rel, proj, config) {
  return matchesAny(rel, testGlobs(proj, config));
}
export function isTestConfig(rel) {
  return matchesAny(rel, TEST_CONFIG_GLOBS);
}
