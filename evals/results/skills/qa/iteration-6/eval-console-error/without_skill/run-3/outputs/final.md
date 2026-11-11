The button's click handler crashes on its first line, so it never writes anything to the page.

**What I saw in the browser:** I opened `app.html` in headless Chromium using Playwright and clicked **Load report**. The page threw this error, and `#out` stayed empty:

```
Expected ',' or '}' after property value in JSON at position 12 (line 1 column 13)
```

**Cause:** `app.html:5`
```js
const data = JSON.parse('{"total": 12');
```
The JSON string has no closing `}`. `JSON.parse` throws a `SyntaxError`, the handler stops there, and the line that sets `textContent` never runs. Nothing appears on screen because uncaught errors only show in the browser's console.

**Fix:** close the object:
```js
const data = JSON.parse('{"total": 12}');
```
With that change, clicking the button should show "Total: 12". I haven't edited the file, so tell me if you want me to apply the fix.

If this string will eventually come from a real response (e.g. `fetch`), it's also worth wrapping the parse in `try/catch` and showing an error message. Then bad data shows a visible message instead of failing silently like this.