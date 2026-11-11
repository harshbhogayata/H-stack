The button's click handler crashes before it writes anything to the page.

I opened `app.html` in headless Chromium with Playwright and clicked **Load report**. The page threw this error and `#out` stayed empty:

```
pageerror: Expected ',' or '}' after property value in JSON at position 12 (line 1 column 13)
```

**Cause:** in `app.html:5`, the handler tries to read this text as JSON:

```js
const data = JSON.parse('{"total": 12');
```

The string is missing its closing `}`, so it isn't valid JSON. `JSON.parse` throws, and the line that would show "Total: …" never runs. Nothing catches the error, so the only trace is in the browser's developer console, which is why the button seems to do nothing.

**Fix:** add the closing brace: `JSON.parse('{"total": 12}')`. If the real data will come from a server, also wrap the parse in `try/catch` and show an error message, so bad data doesn't fail silently again. I haven't changed the file; I can make the fix if you want.