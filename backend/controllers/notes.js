const notesRouter = require("express").Router();
const Note = require("../models/note");
const User = require("../models/user");
const logger = require("../utils/logger");
const jwt = require("jsonwebtoken");
const config = require("../utils/config");

const getTokenFrom = (req) => {
  const auth = req.get("Authorization");
  if (auth && auth.toLowerCase().startsWith("bearer ")) {
    return auth.substring(7);
  }
};

// GET ALL
notesRouter.get("/", async (req, res) => {
  const notes = await Note.find({}).populate("user", { username: 1 });
  res.json(notes);
});

// GET INDIVIDUAL
notesRouter.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  const note = await Note.findById(id);

  if (note) {
    res.json(note);
  } else {
    logger.error("no such no in db");
    res.status(404).end();
  }
});

// POST
notesRouter.post("/", async (req, res) => {
  const body = req.body;

  // authorize user
  const token = getTokenFrom(req);
  const decodedToken = jwt.verify(token, config.TOKEN_SECRET);
  if (!decodedToken.id) {
    return res.status(401).json({ error: "invalid token" });
  }
  const user = await User.findById(decodedToken.id);

  if (!body.content) {
    return res.status(400).json({ error: "content misssing" });
  }

  const noteObj = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
    user: user._id,
  });

  const note = await noteObj.save();
  user.notes = user.notes.concat(note._id);
  await user.save();

  res.status(201).json(note);
});

// PUT
notesRouter.put("/:id", async (req, res, next) => {
  const body = req.body;

  const newNote = {
    content: body.content,
    important: body.important,
  };

  const noteObj = await Note.findByIdAndUpdate(req.params.id, newNote, { new: true });
  res.json(noteObj);
});

// DELETE
notesRouter.delete("/:id", async (req, res, next) => {
  const newNote = await Note.findByIdAndDelete(req.params.id);

  if (!newNote) {
    logger.error("no such note");
    res.status(404).send("no such note in db");
  } else {
    res.status(204).json(newNote);
  }
});

module.exports = notesRouter;
