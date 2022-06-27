const notesRouter = require("express").Router();
const Note = require("../models/note");
const logger = require("../utils/logger");

// GET ALL
notesRouter.get("/", (req, res) => {
  Note.find({}).then((notes) => res.json(notes));
});

// GET INDIVIDUAL
notesRouter.get("/:id", (req, res, next) => {
  const id = req.params.id;

  Note.findById(id)
    .then((note) => {
      if (note) {
        res.json(note);
      } else {
        logger.error("no such note in db");
        response.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});

// POST
notesRouter.post("/", (req, res) => {
  const body = req.body;

  if (!body.content) {
    return res.status(400).json({ error: "content misssing" });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });

  note.save().then((savedNote) => {
    res.json(savedNote);
  });
});

// PUT
notesRouter.put("/:id", (req, res, next) => {
  const body = req.body;

  const note = {
    content: body.content,
    important: body.important,
  };

  Note.findByIdAndUpdate(req.params.id, note, { new: true })
    .then((updatedNote) => {
      res.json(updatedNote);
    })
    .catch((error) => next(error));
});

// DELETE
notesRouter.delete("/:id", (req, res, next) => {
  Note.findByIdAndRemove(req.params.id)
    .then((result) => {
      if (!result) {
        logger.error("no such note");
        res.status(404).send("no such note in db");
      } else {
        res.status(204).end();
      }
    })
    .catch((error) => next(error));
});

module.exports = notesRouter;
