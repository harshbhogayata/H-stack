I saved the note to `notes/json-schema-validator-ajv-vs-zod.md`, but nothing in it is verified yet. The repo has no `node_modules`, and permission to fetch web pages wasn't granted. I didn't work around that with curl, so the note is written from what I already know. Each claim is marked "inferred" next to the official doc page it should be checked against.

**Answer: use Ajv.**
- **Ajv** is a JSON Schema validator and supports draft 2020-12. You use a separate class, `Ajv2020`, loaded from `ajv/dist/2020`; the default `Ajv` export targets draft-07. Draft-07 and 2020-12 schemas can't be mixed in one instance.
- **Zod** is not a JSON Schema validator. You write schemas in TypeScript and it checks data against those. Zod 4 can *export* a schema as JSON Schema (draft 2020-12 by default) with `z.toJSONSchema()`, but it can't take an existing 2020-12 schema document and validate data against it.

**Open questions listed in the note:**
- Whether Ajv fully supports some 2020-12 features (`$dynamicRef`/`$dynamicAnchor` and `unevaluated*`).
- Which Ajv version first shipped `Ajv2020` (I believe v8).
- Whether current Zod can import JSON Schema, and how completely.

To turn these into confirmed findings, approve fetching the cited pages, or run `npm i ajv zod` so I can read the installed source. I created the `notes/` folder because the repo had no existing place for notes.