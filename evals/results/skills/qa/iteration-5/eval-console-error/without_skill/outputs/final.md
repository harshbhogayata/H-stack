The button is wired up, but its click handler crashes before it can show anything.

I opened `app.html` in headless Chromium and clicked **Load report**. The page threw this uncaught error, and `#out` stayed empty:

```
SyntaxError: Expected ',' or '}' after property value in JSON at position 12 (line 1 column 13)
```

The cause is in `app.html:5`:

```js
const data = JSON.parse('{"total": 12');
```

The JSON string has no closing `}`. `JSON.parse` throws, so the line that writes `Total: …` into `#out` never runs. The error only appears in the dev-tools console, which is why the click looks like it does nothing.

**Fix:** close the object, so the line reads `JSON.parse('{"total": 12}')`. The page should then show `Total: 12`. If this string will eventually come from a server or file, put the parse in a `try/catch` and show an error message, so bad data doesn't fail silently again.

I haven't changed the file. I can make the fix and re-run the browser check if you want.