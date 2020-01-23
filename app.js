const path = require("path");
const fs = require("fs");

const express = require("express");
const mysql = require("mysql");

const app = express();

app.static(path.join(__dirname, "public"));

// rendered page

// /notes : notes.html
// * : index.html

// API

// GET /api/notes
// POST /api/notes
// DELETE /api/notes/:id
