const users = new Map([
  ['tok_alice_7f3a', { id: 'cust_alice', name: 'Alice Example' }],
  ['tok_bob_91c2', { id: 'cust_bob', name: 'Bob Example' }],
]);

const invoices = new Map([
  ['inv_1001', { id: 'inv_1001', customer: 'cust_alice', status: 'paid', total: 4200, lines: [{ item: 'Hosting', cents: 4200 }] }],
  ['inv_1002', { id: 'inv_1002', customer: 'cust_bob', status: 'open', total: 99000, lines: [{ item: 'Consulting', cents: 99000 }] }],
  ['inv_1003', { id: 'inv_1003', customer: 'cust_bob', status: 'paid', total: 1500, lines: [{ item: 'Domain', cents: 1500 }] }],
]);

module.exports = { users, invoices };
