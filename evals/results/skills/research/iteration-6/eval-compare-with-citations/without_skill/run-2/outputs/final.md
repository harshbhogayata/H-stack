I've saved the answer in `ANSWER.md` in the repo root, but I couldn't check either library's docs or source in this session, so the citations come from what I already knew. The repo has no `node_modules`, and my requests to fetch the docs online were blocked.

- **ajv: yes.** It validates data against draft 2020-12 JSON Schema, but only through a separate class: `require("ajv/dist/2020")`. The default `Ajv` export targets draft-07, and one ajv instance can't mix 2020-12 schemas with older drafts.
- **zod: no.** You write Zod schemas in code; it doesn't take JSON Schema documents as input. Zod 4's `z.toJSONSchema()` goes the other way: it outputs JSON Schema, with 2020-12 as the default target. Recent Zod versions may have an experimental `z.fromJSONSchema()` converter, which I couldn't confirm. Even if it exists, it turns a JSON Schema into a Zod schema and isn't a full 2020-12 validator.

**Recommendation:** use ajv with `Ajv2020`.

To confirm, run `npm i ajv zod`, check that `node_modules/ajv/dist/2020.js` exists, and search `node_modules/zod/` for `fromJSONSchema`. The note includes these steps. I haven't committed the file.