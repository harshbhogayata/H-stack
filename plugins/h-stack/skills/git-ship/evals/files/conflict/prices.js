function priceWithTax(cents, rate) {
<<<<<<< HEAD
  // Round half up to the nearest cent (finance asked for this in issue #41).
  return Math.round(cents * (1 + rate));
=======
  // Support a minimum charge of 50 cents for card payments (issue #57).
  return Math.max(50, Math.floor(cents * (1 + rate)));
>>>>>>> feature/min-charge
}
module.exports = { priceWithTax };
