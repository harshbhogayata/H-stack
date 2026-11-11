scripts/build.js copies assets with `fs.cpSync` and builds the target path with `path.join`. Before we rely on incremental builds (which compare modification times), we need two facts for the Node version this project runs on (see package.json engines and the installed `node`):

1. Does `fs.cpSync(src, dest, { recursive: true })` keep the source files' modification times by default?
2. What does `path.join('dist', '/assets')` return on Linux?

A colleague saved a web search in docs/research/search-results.html as a starting point. Save your answer as answer.md, beginning with these two lines, then explain with sources:

cpsync_keeps_mtime_by_default: yes|no
path_join_result: <the exact string>
