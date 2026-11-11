We did this release dance three times this month, each time the same:
1. npm run build
2. node scripts/check-bundle-size.js --max-kb 250
3. git tag v$(node -p "require(\"./package.json\").version")
4. npm run changelog -- --since-last-tag
It failed once when step 2 was skipped and a 400 KB bundle shipped.
