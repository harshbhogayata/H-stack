The button's click handler crashes before it can show anything, because the JSON it tries to parse is incomplete.

**What I saw in the browser:** I opened `app.html` in headless Chromium with Playwright and clicked **Load report**. The page threw an error and `#out` stayed empty:

```
pageerror: Expected ',' or '}' after property value in JSON at position 12 (line 1 column 13)
```

**Cause:** `app.html:5`

```js
const data = JSON.parse('{"total": 12');
```

The JSON string has no closing `}`, so `JSON.parse` throws a `SyntaxError`. Nothing catches it, so the handler stops before it reaches the line that writes `Total: …` into `#out`. Users see nothing happen, and the error only appears in the browser's console.

**Fix:** close the object:

```js
const data = JSON.parse('{"total": 12}');
```

If this string is a placeholder for data that will really come from a server, also wrap the parse in a `try/catch` and show an error on the page. That way bad data gives a visible message instead of a silent failure.

I haven't changed the file. I can apply the fix and re-run the browser check if you want.