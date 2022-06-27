const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Note = require("../models/note");

const api = supertest(app);

const initialNotes = [
  {
    content: "HTML is easy",
    date: new Date(),
    important: false,
  },
  {
    content: "Browser can execute only Javascript",
    date: new Date(),
    important: true,
  },
];

describe("notes", () => {
  // clear db & initialize dummy notes
  beforeEach(async () => {
    await Note.deleteMany({});

    const noteObjects = initialNotes.map((note) => new Note(note));
    const promiseArray = noteObjects.map((note) => note.save());
    await Promise.all(promiseArray);
  });

  // Check if the notes are returned in json format
  test("notes are returned as json", async () => {
    await api
      .get("/api/notes")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  // First note should be about http methods
  test("the first note is about HTTP methods", async () => {
    const response = await api.get("/api/notes/");

    expect(response.body[0].content).toBe("HTML is easy");
  });

  // See if all notes are returned
  test("all notes are returned", async () => {
    const response = await api.get("/api/notes/");

    expect(response.body).toHaveLength(initialNotes.length);
  });

  // Check if a specific note is within the response
  test("a specific note is within the returned notes", async () => {
    const response = await api.get("/api/notes");
    const content = response.body.map((n) => n.content);

    expect(content).toContain("HTML is easy");
  });

  // See if a valid note can be added
  test("a valid note can be added", async () => {
    const newNote = {
      content: "hello new note",
      important: true,
    };

    // see the post req
    await api
      .post("/api/notes")
      .send(newNote)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/notes");
    const contents = response.body.map((r) => r.content);

    // see if note added
    expect(response.body).toHaveLength(initialNotes.length + 1);

    // see if notes contain
    expect(contents).toContain("hello new note");
  });

  // Close the mongoose connection
  afterAll(() => {
    mongoose.connection.close();
  });
});
