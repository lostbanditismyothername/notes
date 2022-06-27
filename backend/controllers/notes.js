const notesRouter = require("express").Router();
const Note = require("../models/note");
const logger = require("../utils/logger");
require("express-async-errors");
// GET ALL
notesRouter.get("/", async (req, res) => {
  const notes = await Note.find({});
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

  if (!body.content) {
    return res.status(400).json({ error: "content misssing" });
  }

  const noteObj = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });

  const note = await noteObj.save();

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
  const newNote = await Note.findByIdAndUpdate(req.params.id);

  if (!newNote) {
    logger.error("no such note");
    res.status(404).send("no such note in db");
  } else {
    res.status(204).end();
  }
});

module.exports = notesRouter;
