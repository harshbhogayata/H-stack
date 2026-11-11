// Transfers money between two accounts held in memory.
const accounts = new Map([['a', 100], ['b', 50]]);
function balance(id) { return accounts.get(id); }
function transfer(from, to, amount) {
  if (amount <= 0) throw new Error('amount must be positive');
  accounts.set(from, accounts.get(from) - amount);
  accounts.set(to, accounts.get(to) + amount);
}
module.exports = { balance, transfer };
