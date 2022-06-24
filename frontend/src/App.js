import Note from "./components/Note";
import { useEffect, useState } from "react";
import * as noteService from "./services/notes";
import Notification from "./components/Notification";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("a new note..");
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    fetchNotes();

    async function fetchNotes() {
      const notes = await noteService.getAll();
      setNotes(notes);
    }
  }, []);

  // create a new note
  const addNote = (e) => {
    e.preventDefault();

    const noteObj = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() < 0.5,
      id: notes.lenght + 1,
    };

    noteService.create(noteObj).then((returnedObj) => {
      setNotes(notes.concat(returnedObj));
      setNewNote("");
    });
  };

  // handle inputs
  const handleNoteChange = (e) => setNewNote(e.target.value);

  // filtered notes
  const notesToShow = showAll ? notes : notes.filter((note) => note.important === true);

  // toggle importance of a note
  const toggleImportanceOf = (id) => {
    const note = notes.find((note) => note.id === id);
    const changedNote = { ...note, important: !note.important };

    noteService
      .update(id, changedNote)
      .then((returnedObj) => {
        setNotes(notes.map((note) => (note.id !== id ? note : returnedObj)));
      })
      .catch((error) => {
        setErrorMessage(`Error while changing note: ${error.message}`);
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
  };

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>show {showAll ? "important" : "all"}</button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)} />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
    </div>
  );
};

export default App;
