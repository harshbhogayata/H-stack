# Slug improvements plan

Goal: slugs safe for URLs. Test command: `npm test`.

## Interfaces
- `slugify(title: string): string` in `src/slug.js` (exists)
- `uniqueSlug(title: string, taken: Set<string>): string` in `src/slug.js` (new)

## Task 1: strip punctuation
- [ ] Step 1: add test `strips punctuation` in `test/slug.test.js`: `slugify('Hello, World!')` === `'hello-world'`
- [ ] Step 2: run `npm test`, expect the new test to fail
- [ ] Step 3: make `slugify` drop every character that is not a-z, 0-9 or a hyphen, and collapse repeated hyphens
- [ ] Step 4: run `npm test`, expect pass

## Task 2: unique slugs
- [ ] Step 1: add test `appends a counter when taken`: `uniqueSlug('Hello World', new Set(['hello-world']))` === `'hello-world-2'`; and with `['hello-world','hello-world-2']` === `'hello-world-3'`
- [ ] Step 2: run `npm test`, expect fail
- [ ] Step 3: implement `uniqueSlug`
- [ ] Step 4: run `npm test`, expect pass
