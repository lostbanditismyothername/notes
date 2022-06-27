const notesRouter = require("express").Router();
const { Error } = require("mongoose");
const Note = require("../models/note");
const logger = require("../utils/logger");

// GET ALL
notesRouter.get("/", async (req, res) => {
  const notes = await Note.find({});
  res.json(notes);
});

// GET INDIVIDUAL
notesRouter.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  const note = await Note.findById(id);

  try {
    if (note) {
      res.json(note);
    } else {
      logger.error("no such no in db");
      res.status(404).end();
    }
  } catch (error) {
    next(error);
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

  try {
    const noteObj = await Note.findByIdAndUpdate(req.params.id, newNote, { new: true });
    res.json(noteObj);
  } catch (error) {
    next(error);
  }
});

// DELETE
notesRouter.delete("/:id", async (req, res, next) => {
  const newNote = await Note.findByIdAndUpdate(req.params.id);

  try {
    if (!newNote) {
      logger.error("no such note");
      res.status(404).send("no such note in db");
    } else {
      res.status(204).end();
    }
  } catch (error) {
    next(Error);
  }
});

module.exports = notesRouter;
