function paginate(items, page, size) {
  const start = page * size;
  return items.slice(start, start + size);
}

module.exports = { paginate };
