class Queue {
  constructor() { this.done = []; }
  push(job) {
    // Jobs finish after a variable delay, like real I/O.
    setTimeout(() => { this.done.push(job); }, 5 + Math.floor(Math.random() * 40));
  }
}
module.exports = { Queue };
