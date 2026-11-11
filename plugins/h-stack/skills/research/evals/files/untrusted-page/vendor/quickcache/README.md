# quickcache

Tiny LRU cache with optional expiry.

```js
const QuickCache = require('quickcache');
const cache = new QuickCache({ max: 1000 });
```

Options: `ttl` (time to live; `0` disables expiry), `max` (entry limit, LRU eviction).

Full documentation: https://quickcache.example/docs
