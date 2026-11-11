The JSON string in the click handler is broken, so clicking the button throws an error before anything is shown.

**What I saw in the browser** (headless Chromium, `app.html` loaded from disk):
- The page has one button, "Load report".
- After clicking it, `#out` stays empty (`""`).
- The page threw one uncaught error on the click: `Expected ',' or '}' after property value in JSON at position 12 (line 1 column 13)`.
- There were no other console messages and no failed network requests.

**Cause:** `app.html:5`
```js
const data = JSON.parse('{"total": 12');   // missing closing }
```
The JSON is missing its closing `}`. `JSON.parse` throws a `SyntaxError`, so line 6, which writes the total into `#out`, never runs. Nothing catches the error, so nothing appears on the page; the error only shows up in the console.

**Fix:** add the closing brace: `JSON.parse('{"total": 12}')`. The page should then show "Total: 12". I haven't changed the file or tested the fix in the browser.

If this string will later come from a real `fetch`, wrap the parse in `try/catch` and show an error message in `#out`. That way bad data gives a visible error instead of a button that seems to do nothing.

The test script is `/tmp/claude-0/-tmp-hs-bench-2iEeiA/3472f99c-fb89-4288-8112-ecafe7371e2b/scratchpad/check.js`, and the screenshot taken after the click is `/tmp/claude-0/-tmp-hs-bench-2iEeiA/3472f99c-fb89-4288-8112-ecafe7371e2b/scratchpad/after-click.png`.