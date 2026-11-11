I saved the answer in `ANSWER.md`. It doesn't include the citations you asked for: the repo has no `node_modules`, and fetching the ajv and zod docs was denied. Everything in it comes from my own knowledge, and the note says so at the top.

- **ajv: yes.** It validates against draft 2020-12 JSON Schema documents, but only through a separate class, `Ajv2020`, imported from `ajv/dist/2020`. The default `Ajv` export targets draft-07, so a 2020-12 schema compiled with it can fail or behave incorrectly.
- **zod: no.** You define Zod schemas in TypeScript code, and it doesn't validate data against JSON Schema documents. Version 4's `z.toJSONSchema()` only converts the other way, turning a Zod schema into JSON Schema (2020-12 by default).

**Recommendation:** use ajv with `Ajv2020`.

To add the citations, either allow web fetch for ajv.js.org and zod.dev or let me run `npm i ajv zod` so I can quote the installed source. The note lists the exact pages and files to check.