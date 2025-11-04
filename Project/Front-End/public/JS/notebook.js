const notesList = document.getElementById("notesList");
const editor = document.getElementById("editor");
const noteTitle = document.getElementById("noteTitle");
const noteContent = document.getElementById("noteContent");
const newNoteBtn = document.getElementById("newNoteBtn");
const saveNoteBtn = document.getElementById("saveNoteBtn");
const deleteNoteBtn = document.getElementById("deleteNoteBtn");

let activeNoteId = null;

// Load all notes
async function loadNotes() {
  try {
    const res = await fetch("/getNotes");
    const notes = await res.json();
    renderNotes(notes);
  } catch (err) {
    console.error("Error loading notes:", err);
  }
}

// Render the notes list
function renderNotes(notes) {
  notesList.innerHTML = "";
  if (!notes.length) {
    notesList.innerHTML = "<p>No notes yet.</p>";
    return;
  }
  notes.forEach(note => {
    const div = document.createElement("div");
    div.classList.add("note-item");
    div.textContent = note.title || "Untitled";
    div.onclick = () => openNote(note);
    notesList.appendChild(div);
  });
}

// Open selected note
function openNote(note) {
  activeNoteId = note._id;
  noteTitle.value = note.title;
  noteContent.value = note.content;
  editor.style.display = "block";
}

// Create a new note
newNoteBtn.onclick = () => {
  activeNoteId = null;
  noteTitle.value = "";
  noteContent.value = "";
  editor.style.display = "block";
};

// Save note
saveNoteBtn.onclick = async () => {
  const note = {
    title: noteTitle.value,
    content: noteContent.value,
    id: activeNoteId
  };

  try {
    await fetch("/saveNote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(note)
    });
    loadNotes();
    alert("Note saved!");
  } catch (err) {
    console.error("Save failed:", err);
    alert("Failed to save note.");
  }
};

// Delete note
deleteNoteBtn.onclick = async () => {
  if (!activeNoteId) return alert("No note selected.");
  try {
    await fetch(`/deleteNote/${activeNoteId}`, { method: "DELETE" });
    editor.style.display = "none";
    loadNotes();
  } catch (err) {
    console.error("Delete failed:", err);
    alert("Failed to delete note.");
  }
};

// Initialize
loadNotes();
