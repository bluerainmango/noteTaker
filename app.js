const path = require("path");
const express = require("express");

const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");

const {
  getNoteHandler,
  postNoteHandler,
  deleteNoteHandler,
  addIdToNote
} = require("./dev/controller");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

//! SECURITY
app.use(helmet());
app.use(xss());
const limiter = rateLimit({
  max: 100,
  windowsMS: 60 * 60 * 1000,
  message: "Too many requests from this IP. Try later!"
});
app.use("/api", limiter);

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

//! SERVER
app.listen(PORT, err => {
  if (err) console.log(err);
  console.log("Listening...");
});

//! Global error handling middleware
app.use((err, req, res, next) => {
  // For internal check
  console.log(err);

  // For sending err to client
  res
    .status(500)
    .send(
      "🚨 Something went wrong. Cannot operate as you requested. Try later."
    );
});
