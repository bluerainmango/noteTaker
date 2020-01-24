const path = require("path");
const fs = require("fs");
const { promisify } = require("util");

//* Utility: Get the notes(array) from DB
exports.getNotesFromDB = async () => {
  const readFile = promisify(fs.readFile);
  const notes = await readFile(path.join(__dirname, "db", "db.json"), "utf8");

  return JSON.parse(notes);
};

//* Utility: Save the notes to DB
exports.saveNotesToDB = async updatedData => {
  const writeFile = promisify(fs.writeFile);

  await writeFile(
    path.join(__dirname, "db", "db.json"),
    JSON.stringify(updatedData)
  );
};
