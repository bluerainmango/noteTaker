const { getNotesFromDB, saveNotesToDB } = require("./utility");

//! FUNCTIONS
//* Handler(GET)
exports.getNoteHandler = async (req, res) => {
  const notes = await getNotesFromDB();
  res.status(200).send(notes);
};

// * Handler(POST)
exports.postNoteHandler = async (req, res) => {
  const notes = await getNotesFromDB();
  notes.push(req.body);

  await saveNotesToDB(notes);

  res.status(200).send("Successfully posted.");
};

// * Handler(DELETE)
exports.deleteNoteHandler = async (req, res) => {
  const notes = await getNotesFromDB();

  // Delete a note having the same id of req
  const targetId = req.params.id * 1;
  const notesAfterDelete = notes.filter(note => note.id !== targetId);

  await saveNotesToDB(notesAfterDelete);
  res.status(200).send("Successfully deleted.");
};

//* Middleware(POST): Add the auto incremented id to req.body
exports.addIdToNote = async (req, res, next) => {
  // New note's id : incremented from the previous note's id
  const notes = await getNotesFromDB();
  req.body.id = notes[notes.length - 1].id + 1;

  next();
};
