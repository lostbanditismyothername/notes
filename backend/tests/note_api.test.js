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
    initialNotes.map(async (note) => {
      let noteObj = new Note(note);
      await noteObj.save();
    });
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

    expect(response.body[0].content).toBe("Browser can execute only Javascript");
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

  // Close the mongoose connection
  afterAll(() => {
    mongoose.connection.close();
  });
});
