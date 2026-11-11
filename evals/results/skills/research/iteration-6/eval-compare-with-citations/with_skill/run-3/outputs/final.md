I saved the note as `notes/json-schema-validator-ajv-vs-zod.md`, but none of it is cited. I couldn't reach a primary source in this run, so every claim is marked "inferred" and comes from what I already knew about these libraries.

- **Why there are no sources:** the WebFetch calls to the ajv and zod docs were not permitted, and there is no `node_modules` here. I checked the repo, `/usr` and `/root` for local copies and found nothing.
- **ajv:** it validates draft 2020-12 JSON Schema documents. You have to use the separate `Ajv2020` class from `ajv/dist/2020`, because the default `ajv` import targets draft-07. Format checks need the `ajv-formats` plugin.
- **zod:** it does not validate JSON Schema documents. It validates data against schemas written in Zod itself. Zod 4 can export JSON Schema (2020-12 by default) with `z.toJSONSchema()`. I also listed an open question: whether current Zod has an importer from JSON Schema, and how much of 2020-12 it would cover.
- **Recommendation:** use ajv for this.

Each claim in the note lists the doc page that should confirm it. To get real citations, either allow web fetch or run `npm i ajv zod` so I can read the installed source and record the versions. The note isn't committed.