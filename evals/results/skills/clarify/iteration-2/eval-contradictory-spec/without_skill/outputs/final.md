I haven't written any code yet, because the two rules in SPEC.md contradict each other:

- **Rule 1:** a deleted account must be erased completely within 24 hours, for GDPR requests.
- **Rule 2:** all account data must be kept for 7 years for audit, and nothing may be deleted.

A deletion endpoint can't satisfy both. Whichever one I pick decides whether you meet your GDPR obligations or your audit obligations, so I need you or your legal/compliance team to choose.

**A common way to reconcile them:** GDPR lets you keep data you're legally required to retain (Article 17(3)(b)). So the endpoint would:

1. **Within 24 hours,** erase or irreversibly anonymize personal data that isn't needed for audit: profile, contact details, preferences and content.
2. **Keep only the audit records the law requires,** such as financial transactions, linked to a pseudonymous ID. They'd be locked down, used only for audit, and purged automatically after 7 years.
3. **Log the deletion request** and what was kept, and on what legal basis, so you can answer the user and a regulator.

This only works if someone confirms which records actually have to be kept for 7 years. "All account data, no deletion allowed" is almost certainly broader than the law requires, and keeping everything would itself breach GDPR.

The repo also has nothing in it except SPEC.md, so I need a few more answers before I start:

1. **Retention:** should I go with the approach above? If so, which data has to be kept for audit?
2. **Stack:** which language and framework? For example Node/Express, Python/FastAPI or Go.
3. **Storage:** what database or data model holds the accounts? Should I define one, with an in-memory or SQLite store for now?
4. **Auth:** who can call the endpoint? Only the account owner, admins too, or both?

Once you confirm, I'll build the endpoint, the scheduled erasure job, the 7-year purge and tests.