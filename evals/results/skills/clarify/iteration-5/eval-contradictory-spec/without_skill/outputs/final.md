I haven't written any code yet. SPEC.md contradicts itself, and the right fix is a legal and product decision, not something I should guess at.

The spec has two retention rules that can't both hold:
1. "Deleted accounts must be erased completely within 24 hours (GDPR request handling)."
2. "All account data must be kept for 7 years for audit, with no deletion allowed."

A deletion endpoint can only satisfy one of them. Whichever I picked, the code would break the other rule, either by failing to erase data or by destroying audit records.

**Usual fix:** GDPR Article 17(3)(b) lets you keep data you're legally required to retain. So the endpoint could:
- Erase or irreversibly anonymise personal data (name, email, profile, content) within 24 hours.
- Keep a minimal audit record for 7 years: account ID, timestamps, transactions or legal records the law requires, and a log of the deletion request. Personal identifiers would be removed or pseudonymised, and access to the record restricted.
- Purge the audit record automatically once the 7 years are up.

**What I need from you:**
1. **Which rule wins, or is the fix above acceptable?** Ideally someone on your legal or compliance side should confirm which data the 7-year rule covers.
2. **What stack should I use?** The repo only has SPEC.md, with no code, framework, language or database. Tell me what to use, or I'll default to a small Python/FastAPI service with SQLite and tests.

Once you answer, I'll update SPEC.md so it no longer contradicts itself and build the endpoint to match.