I saved the note as `notes/json-schema-validator.md`. None of it is checked against docs or source: the repo has no `node_modules`, and npm and web fetches weren't approved in this run. It doesn't meet the skill's citation rule yet, and everything in it comes from what I already knew.

**Answer: use ajv.**
- **ajv** is a JSON Schema validator and supports draft 2020-12 through a separate class, `import Ajv2020 from "ajv/dist/2020"`. The default `Ajv` class targets draft-07.
- **zod** doesn't validate data against a JSON Schema document. Its JSON Schema support goes the other way: `z.toJSONSchema()` turns a zod schema into JSON Schema, and I believe its default output is draft 2020-12.

**In the note:**
- A table of six claims, each marked "recalled" and paired with the official docs page (or `node_modules` path) to check it against.
- A short ajv usage example, which I haven't run.
- Open questions: current versions, whether zod's experimental `z.fromJSONSchema()` exists and what it covers, and where ajv falls short of the official 2020-12 test suite.

To turn this into a cited answer, allow web fetches (or `npm view`, or `npm i ajv ajv-formats zod` in the repo). I'd then check each claim against the source and replace "recalled" with the actual citations. I haven't committed the note.