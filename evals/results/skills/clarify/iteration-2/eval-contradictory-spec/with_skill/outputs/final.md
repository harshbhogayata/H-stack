**Outcome: Ask.** I haven't written any code, because SPEC.md contradicts itself and only you can decide which rule wins.

The whole repo is `SPEC.md` and one commit. The spec says:

- Deleted accounts must be erased completely within 24 hours (GDPR).
- All account data must be kept for 7 years for audit, with no deletion allowed.

An account deletion endpoint can't do both. Whichever way I go, it destroys data or keeps it, and both have legal consequences, so I won't pick for you.

**1. How should erasure and the 7-year audit retention be reconciled?**
- **(Recommended) Split the data:** within 24 hours, erase or irreversibly anonymise all personal data. Keep only a minimal audit record for 7 years, such as the account ID, timestamps, event types and the fact that a deletion was requested and done, with no personal fields. GDPR Art. 17(3)(b) allows keeping data a legal obligation requires. This keeps both rules in spirit, but "no deletion allowed" would then mean "no deletion of audit events", not "of all account data".
- Erasure wins: hard-delete everything within 24 hours and drop the 7-year rule for account data.
- Retention wins: no erasure. The endpoint deactivates or locks the account and keeps everything for 7 years, which likely breaks GDPR.
- Why it matters: this decides the data model, which tables get deleted, scrubbed or kept, and whether a background job is needed. Someone who owns the compliance call should sign off.

**2. What stack should this be built in?** The repo has no code, framework or database to follow.
- **(Recommended) A small TypeScript + Express service with SQLite.** It would have a `DELETE /accounts/:id` endpoint that anonymises right away, an `audit_events` table, and tests showing the 24-hour and 7-year rules.
- Or tell me your language, framework and database, or point me at the real codebase this belongs in.
- Why it matters: everything else I build depends on it.

If you accept both recommendations, I'll build it straight away.