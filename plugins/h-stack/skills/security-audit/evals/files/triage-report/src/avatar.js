const AVATAR_ORIGIN = 'https://avatars.example-cdn.net';

function avatarUrl(user) {
  return new URL(`/u/${encodeURIComponent(String(user))}.png`, AVATAR_ORIGIN).toString();
}

async function getAvatar(req, http) {
  const res = await http.get(avatarUrl(req.query.user || 'default'));
  return { status: res.status, body: res.body };
}

module.exports = { avatarUrl, getAvatar };
