I turned the release steps into a script, `scripts/release.sh`. You now run it with `npm run release`. I haven't run it: the test run and a plain syntax check both needed permission I don't have here.

**What it does**
1. Exits before doing anything if the tag for the current version already exists. This catches a release where nobody bumped the version.
2. Runs the four steps from NOTES.md in order: build, check bundle size, tag `v<version>`, then generate the changelog.
3. Stops at the first step that fails. If the size check fails, nothing gets tagged or released, so the 400 KB bundle problem can't happen again.
4. The size limit is 250 KB by default. You can change it for one run with `MAX_KB=300 npm run release`.
5. It doesn't push the tag. At the end it prints the `git push origin vX.Y.Z` command for you to run.

**Change in `package.json`:** added `"release": "bash scripts/release.sh"`. Because the command goes through `bash`, the script doesn't need to be executable. I couldn't change its permissions anyway.

**Before you rely on it:** `scripts/check-bundle-size.js` is only a placeholder. It just prints "bundle ok", ignores `--max-kb`, and always succeeds. So the script stops nothing yet: a 400 KB bundle would still pass until that check measures the bundle and fails when it's over the limit. The `build` and `changelog` npm scripts are placeholders too (`echo`).

To test it safely, run `npm run release` in a scratch clone, since it creates a real git tag. You might also update NOTES.md to point to `npm run release` so people stop doing it by hand.