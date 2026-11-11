const { getDefaults } = require('./settings');

function createCustomer({ id, name, prefs = {} }) {
  if (!id) throw new Error('customer id is required');
  return { id, name, prefs: Object.assign(getDefaults(), prefs) };
}

module.exports = { createCustomer };
