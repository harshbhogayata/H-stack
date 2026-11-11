The release steps from NOTES.md now run with one command, `npm run release`. Its tests all pass (5 of 5). I've only run it as a dry run here, so the real flow hasn't been run in this repo yet and no tag has been created.

**What I added**
- **`scripts/release.mjs`** runs the four steps in the same order as NOTES.md: build, bundle-size check, git tag, changelog. If any step fails, the release stops there, so an oversized bundle can no longer get tagged. The size check can't be skipped, since skipping it is what let the 400 KB bundle ship.
  - `--max-kb N` changes the size limit (default 250).
  - `--dry-run` prints the steps without running them.
  - If the tag for the current version (for example `v3.2.0`) already exists, it stops before building.
- **`scripts/release.test.mjs`** tests the script in a temporary copy of a git repo, so this repo is never touched. It covers:
  - a normal release
  - a failed size check, which leaves no tag and no changelog
  - passing `--max-kb` through
  - refusing when the tag already exists
  - a dry run changing nothing
- **`package.json`**: two new commands, `release` and `test:release`.
- **`NOTES.md`**: a short note pointing to the new command.

The skill-authoring guide recommends a tested script over a written skill, so I didn't write a skill.

`scripts/check-bundle-size.js` in this repo is a placeholder that always prints "bundle ok". The release script relies on it exiting with an error when the bundle is too big, so make sure the real check does that.

Nothing is committed yet.