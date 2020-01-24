const path = require("path");
const fs = require("fs");
const { promisify } = require("util");

const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

//! API
app
  .route("/api/notes")
  .get(getNoteHandler)
  .post(addIdToNote, postNoteHandler);

app.delete("/api/notes/:id", deleteNoteHandler);

//! RENDERED PAGES
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "notes.html"));
});

app.all("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

//! FUNCTIONS
//* Handler(GET)
async function getNoteHandler(req, res) {
  const notes = await getNotesFromDB();
  res.status(200).send(notes);
}

// * Handler(POST)
async function postNoteHandler(req, res) {
  const notes = await getNotesFromDB();
  notes.push(req.body);

  await saveNotesToDB(notes);

  res.status(200).send("Successfully posted.");
}

// * Handler(DELETE)
async function deleteNoteHandler(req, res) {
  const notes = await getNotesFromDB();

  // Delete a note having the same id of req
  const targetId = req.params.id * 1;
  const notesAfterDelete = notes.filter(note => note.id !== targetId);

  await saveNotesToDB(notesAfterDelete);
  res.status(200).send("Successfully deleted.");
}

//* Middleware(POST): Add the auto incremented id to req.body
async function addIdToNote(req, res, next) {
  // New note's id : incremented from the previous note's id
  const notes = await getNotesFromDB();
  req.body.id = notes[notes.length - 1].id + 1;

  next();
}

//* Utility: Get the notes(array) from DB
async function getNotesFromDB() {
  const readFile = promisify(fs.readFile);
  const notes = await readFile(path.join(__dirname, "db", "db.json"), "utf8");

  return JSON.parse(notes);
}

//* Utility: Save the notes to DB
async function saveNotesToDB(updatedData) {
  try {
    const writeFile = promisify(fs.writeFile);

    await writeFile(
      path.join(__dirname, "db", "db.json"),
      JSON.stringify(updatedData)
    );
  } catch (err) {
    throw new Error(err);
  }
}

//! SERVER
app.listen(PORT, err => {
  if (err) console.log(err);
  console.log("Listening...");
});
