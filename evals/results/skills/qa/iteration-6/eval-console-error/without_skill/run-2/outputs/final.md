The button's click handler crashes before it can write anything to the page. I loaded `app.html` in headless Chromium with Playwright and clicked **Load report**. The page threw this error:

```
SyntaxError: Expected ',' or '}' after property value in JSON at position 12 (line 1 column 13)
```

`#out` stayed empty.

**Cause:** `app.html:5` parses a JSON string that is missing its closing brace:

```js
const data = JSON.parse('{"total": 12');   // missing the closing }
```

`JSON.parse` throws, so the line that sets `#out` never runs. Nothing shows on the page, and the error only appears in the browser's devtools console.

**Fix:** close the object:

```js
const data = JSON.parse('{"total": 12}');
```

The page should then show "Total: 12". I haven't changed the file. If this string will eventually come from a fetch or another outside source, it's worth wrapping the parse in `try/catch` and showing an error message in `#out`, so a bad response doesn't fail silently like this again.