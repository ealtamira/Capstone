// notebook.js — handles note creation, saving, deleting

document.addEventListener("DOMContentLoaded", () => {
  const newNoteBtn = document.getElementById("newNoteBtn");
  const editor = document.getElementById("editor");
  const saveNoteBtn = document.getElementById("saveNoteBtn");
  const deleteNoteBtn = document.getElementById("deleteNoteBtn");
  const notesList = document.getElementById("notesList");
  const noteTitle = document.getElementById("noteTitle");
  const noteContent = document.getElementById("noteContent");

  let currentNoteId = null;

  // ✅ Handle NEW NOTE button
  if (newNoteBtn) {
    newNoteBtn.addEventListener("click", () => {
      noteTitle.value = "";
      noteContent.value = "";
      currentNoteId = null;

      if(editor){
        editor.style.display = "block";
      }

      noteTitle.focus();

      // Give some feedback
      newNoteBtn.classList.add("active");
      setTimeout(() => newNoteBtn.classList.remove("active"), 200);

      console.log("📝 New note started.");
    });
  }

  // ✅ Handle SAVE NOTE
  if (saveNoteBtn) {
    saveNoteBtn.addEventListener("click", async () => {
      const title = noteTitle.value.trim();
      const content = noteContent.value.trim();

      if (!title || !content) {
        alert("Please enter a title and content before saving.");
        return;
      }

      const noteData = { title, content };

      try {
        const method = currentNoteId ? "PUT" : "POST";
        const url = currentNoteId
          ? `http://localhost:3030/api/notes/${currentNoteId}`
          : `http://localhost:3030/api/notes`;

        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(noteData),
        });

        if (!response.ok) throw new Error("Save failed");

        console.log("✅ Note saved!");

        loadNotes(); // refresh note list
      } catch (err) {
        console.error("Error saving note:", err);
      }
    });
  }

  // ✅ Handle DELETE NOTE
  if (deleteNoteBtn) {
    deleteNoteBtn.addEventListener("click", async () => {
      if (!currentNoteId) return alert("No note selected to delete.");

      if (!confirm("Delete this note?")) return;

      try {
        await fetch(`http://localhost:3030/api/notes/${currentNoteId}`, {
          method: "DELETE",
        });

        console.log("🗑 Note deleted.");
        noteTitle.value = "";
        noteContent.value = "";
        editor.style.display = "none";
        currentNoteId = null;
        loadNotes();
      } catch (err) {
        console.error("Error deleting note:", err);
      }
    });
  }

  // ✅ Load notes list on page load
  async function loadNotes() {
    try {
      const res = await fetch("http://localhost:3030/api/notes");
      const notes = await res.json();
      notesList.innerHTML = "";

      notes.forEach(note => {
        const div = document.createElement("div");
        div.classList.add("note-item");
        div.textContent = note.title;
        div.addEventListener("click", () => {
          currentNoteId = note._id;
          noteTitle.value = note.title;
          noteContent.value = note.content;
        });
        notesList.appendChild(div);
      });
    } catch (err) {
      console.error("Error loading notes:", err);
    }
  }

  loadNotes();
});
