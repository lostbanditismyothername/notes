const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("Please provide a password");
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://inkyforuse:Cluster.22@cluster0.7sftobi.mongodb.net/noteApp?retryWrites=true&w=majority`;

// Schemas are how the objects are to be stored in the db
const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
});

const Note = mongoose.model("Note", noteSchema);

// Create a new note
mongoose
  .connect(url)
  .then((result) => {
    console.log("Connected to MongoDB");
    const note = new Note({
      content: "Css is easy",
      date: new Date(),
      important: true,
    });
    return note.save();
  })
  .then(() => {
    console.log("note saved");
    return mongoose.connection.close();
  })
  .catch((error) => {
    console.log(error);
  });

// Bring all notes
mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to MongoDB");
    return Note.find({});
  })
  .then((notes) => {
    notes.forEach((n) => console.log(n));
    return mongoose.connection.close();
  })
  .catch((err) => console.log(err));
