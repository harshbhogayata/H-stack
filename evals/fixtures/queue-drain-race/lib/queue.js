function createQueue(worker) {
  const pending = [];
  return {
    push(job) { pending.push(worker(job)); },
    async drain() { const p = pending.splice(0); p.forEach((x) => x.catch(() => {})); return p.length; },
  };
}
module.exports = { createQueue };
