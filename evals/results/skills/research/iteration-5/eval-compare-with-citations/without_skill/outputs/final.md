I wrote the answer to `ANSWER.md`, but I couldn't check it against either library's docs or source, so it's from memory. The repo has no `node_modules`, and installing the packages and fetching their docs both needed permissions this session didn't have.

- **ajv: yes.** Version 8 checks data against draft 2020-12 schemas, but you load it from `ajv/dist/2020`. The default import only handles draft-07. Checking `format` needs the separate `ajv-formats` package.
- **zod: no.** You write schemas in its own TypeScript API and it can't take a JSON Schema file as input. Its JSON Schema feature, `z.toJSONSchema()`, turns a zod schema into JSON Schema (draft 2020-12 by default). That's output only, not validation. Newer versions may also have an experimental `z.fromJSONSchema()`, but I couldn't confirm it exists or how much of 2020-12 it covers.

**Recommendation:** use ajv if you're validating against existing draft 2020-12 schemas.

The note lists the doc pages and `node_modules` files to check. If you allow fetching those pages or running `npm pack`, I can add real citations.