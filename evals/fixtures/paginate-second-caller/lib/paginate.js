// page is 0-based
function paginate(list, page, size = 10) { return list.slice(page * size, page * size + size); }
module.exports = { paginate };
