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
  .post(addIdToNote, postNoteHandler)
  .delete(deleteNoteHandler);

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
  // Increment from lastest note's id
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
function deleteNoteHandler(req, res) {}

// Get the latest notes(array) from DB
async function getNotesFromDB() {
  const notes = await readFile(path.join(__dirname, "db", "db.json"), "utf8");
  return JSON.parse(notes);
}

//! Server
app.listen(PORT, err => {
  if (err) console.log(err);
  console.log("Listening...");
});
