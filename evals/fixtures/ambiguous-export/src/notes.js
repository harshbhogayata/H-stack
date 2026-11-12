const notes = [];
function addNote(title, body, tags = []) { notes.push({ id: notes.length + 1, title, body, tags, created: new Date().toISOString() }); }
function listNotes() { return notes.slice(); }
module.exports = { addNote, listNotes };
