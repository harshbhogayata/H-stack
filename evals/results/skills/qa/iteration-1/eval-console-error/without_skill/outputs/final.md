The click handler crashes on a malformed JSON string, so it never writes anything to the page.

I opened `app.html` in headless Chromium with Playwright and clicked **Load report**. The page threw this error, and `#out` stayed empty:

```
Expected ',' or '}' after property value in JSON at position 12 (line 1 column 13)
```

The cause is in `app.html:5`:

```js
const data = JSON.parse('{"total": 12');
```

The JSON string is missing its closing `}`. `JSON.parse` throws a `SyntaxError`, so the handler stops before reaching the line that sets `#out`. Nothing on the page shows the error; it only appears in the browser console, which is why clicking seems to do nothing.

**Fix:** close the object:

```js
const data = JSON.parse('{"total": 12}');
```

Once fixed, clicking the button should show "Total: 12". If this string stands in for data you'll actually fetch, wrap the parse in a `try/catch` and show an error message on the page, so bad input doesn't fail silently.

I haven't changed the file. Want me to apply the fix and re-run the browser check?