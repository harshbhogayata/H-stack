const form = document.getElementById('signup');
const status = document.getElementById('status');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  status.textContent = 'Subscribing…';
  try {
    await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: form.email.value.trim() }),
    });
    status.textContent = "You're subscribed. Check your inbox for the first issue.";
    form.reset();
  } catch {
    status.textContent = 'Network problem. Please try again.';
  }
});
