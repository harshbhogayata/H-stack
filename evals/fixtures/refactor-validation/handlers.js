function signup(body) {
  if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(body.email)) return { status: 400, error: 'invalid email' };
  return { status: 201, email: body.email.toLowerCase() };
}
function invite(body) {
  const email = String(body.email || '').trim();
  if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(email)) return { status: 400, error: 'invalid email' };
  return { status: 202, email };
}
function updateEmail(body) {
  if (!body.email || !/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(body.email)) return { status: 422, error: 'invalid email' };
  return { status: 200, email: body.email.toLowerCase() };
}
module.exports = { signup, invite, updateEmail };
