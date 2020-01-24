const path = require("path");
const fs = require("fs");
const { promisify } = require("util");

//* Utility: Get the notes(array) from DB
exports.getNotesFromDB = async () => {
  try {
    const readFile = promisify(fs.readFile);
    const notes = await readFile(path.join(__dirname, "db", "db.json"), "utf8");

    return JSON.parse(notes);
  } catch (err) {
    throw err;
  }
};

//* Utility: Save the notes to DB
exports.saveNotesToDB = async updatedData => {
  try {
    const writeFile = promisify(fs.writeFile);

    await writeFile(
      path.join(__dirname, "db", "db.json"),
      JSON.stringify(updatedData)
    );
  } catch (err) {
    throw err;
  }
};

//* Utility: Catch err from async middleware and send it to the global error handling middleware
exports.catchAsync = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
