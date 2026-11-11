I saved the answer in `ANSWER.md`, but the citations are from memory: I couldn't check either library's own docs or source. The repo has no `node_modules` or `package.json`, and my attempts to fetch the ajv and zod docs sites were blocked. The note says this and gives the doc URLs and file paths to check against.

**Answer:**
- **ajv:** yes, it validates data against draft 2020-12 JSON Schema documents. You have to use the separate `ajv/dist/2020` class, because the default import targets draft-07. One ajv instance can't mix the two drafts, and checking the `format` keyword needs the extra `ajv-formats` package.
- **zod:** no. Zod validates against schemas you write in code with its own API, not against JSON Schema documents. Zod 4's `z.toJSONSchema()` goes the other way: it outputs JSON Schema (draft 2020-12 by default) from a zod schema.

**Recommendation:** use ajv if your inputs are 2020-12 schema documents. Zod only fits if you'd rather write the schemas in TypeScript and treat JSON Schema as an output.

If you approve network access, or install both packages, I can replace the remembered citations with the actual docs and `node_modules` source.