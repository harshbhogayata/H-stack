I wrote the note, but I couldn't check either library's own docs or source, which the question asked for. Every claim in it comes from memory and is marked as unconfirmed. There's no `node_modules` in the repo, and npm, web fetching and web search were all blocked in this run.

**Answer (unconfirmed):**
- **ajv:** yes. Version 8 validates data against draft 2020-12 schemas through a separate class, `Ajv2020` from `ajv/dist/2020`. The plain `Ajv` export is for the older draft-07. Checking `format` values like email or date needs the add-on `ajv-formats`.
- **zod:** no, not directly. Zod checks data against schemas you write in its own TypeScript API, not against JSON Schema documents. Zod 4's `z.toJSONSchema()` goes the other way: it turns a Zod schema into a JSON Schema document (draft 2020-12 by default). A newer release may have an experimental `z.fromJSONSchema()` that converts JSON Schema into Zod; I'm not confident it exists.

**Recommendation:** ajv.

For each claim the note gives the page or file to check. It also lists open questions: current versions, how far ajv's `$dynamicRef` support goes, and whether `z.fromJSONSchema` exists. To confirm everything, install both packages and read their files in `node_modules`, or allow web access and I'll check the docs.

Files are in `notes`:
- json-schema-validator.md