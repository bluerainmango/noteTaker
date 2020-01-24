const path = require("path");
const fs = require("fs");
const { promisify } = require("util");

const express = require("express");

//! using 'mysql' for database? Then why using db.json as well?
const mysql = require("mysql");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

//! Rendered pages

//! '*' means all the other url except "/"?
// : index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// /notes : notes.html
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "notes.html"));
});

//! API

app
  .route("/api/notes")
  .get(getNoteHandler)
  .post(postNoteHandler)
  .delete(deleteNoteHandler);

async function getNoteHandler(req, res) {
  const notes = JSON.parse(await readFile(path.join(__dirname, "db", "db.json"), "utf8"));
  // console.log(notes);
  res.status(200).send(notes);
}
async function postNoteHandler(req, res) {
  console.log(req.body);
  const notes = JSON.parse(await readFile(path.join(__dirname, "db", "db.json"), "utf8"));
  notes.push(req.body);
  await writeFile(path.join(__dirname, "db", "db.json"), JSON.stringify(notes));
  res.status(200).send("Successfully posted!");
}
function deleteNoteHandler(req, res) {}

//! Server
app.listen(PORT, err => {
  if (err) console.log(err);
  console.log("Listening...");
});
