const path = require("path");
const fs = require("fs");
const { promisify } = require("util");

const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

//! API
app
  .route("/api/notes")
  .get(getNoteHandler)
  .post(addIdToNote, postNoteHandler);

app.delete("/api/notes/:id", deleteNoteHandler);

//! Rendered pages
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "notes.html"));
});

app.all("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

//! Functions

// Add the auto incremented id to req.body
async function addIdToNote(req, res, next) {
  // Set new note's id by incrementing the previous one's id
  const notes = await getNotesFromDB();
  const id = notes[notes.length - 1].id + 1;
  req.body.id = id;
  next();
}
async function getNoteHandler(req, res) {
  const notes = await getNotesFromDB();
  // console.log(notes);
  res.status(200).send(notes);
}
async function postNoteHandler(req, res) {
  console.log("given new data from client: ", req.body);
  const notes = await getNotesFromDB();
  notes.push(req.body);
  await writeFile(path.join(__dirname, "db", "db.json"), JSON.stringify(notes));
  res.status(200).send("Successfully posted!");
}
async function deleteNoteHandler(req, res) {
  console.log("delete req is requested");
  const notes = await getNotesFromDB();

  // Find the note having the same id of req and delete it
  const targetId = req.params.id * 1;
  const notesAfterDelete = notes.filter((note, i) => note.id !== targetId);

  await saveNotesToDB(notesAfterDelete);
  res.status(200).send("Successfully deleted!");
}

// Get the latest notes(array) from DB
async function getNotesFromDB() {
  const notes = await readFile(path.join(__dirname, "db", "db.json"), "utf8");
  return JSON.parse(notes);
}

// Save the notes to DB
async function saveNotesToDB(updatedData) {
  await writeFile(path.join(__dirname, "db", "db.json"), JSON.stringify(updatedData));
}

//! Server
app.listen(PORT, err => {
  if (err) console.log(err);
  console.log("Listening...");
});
