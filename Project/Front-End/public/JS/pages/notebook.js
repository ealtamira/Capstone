document.addEventListener("DOMContentLoaded", () => {
  const newNoteBtn = document.getElementById("newNoteBtn");
  const editor = document.getElementById("editor");
  const saveNoteBtn = document.getElementById("saveNoteBtn");
  const deleteNoteBtn = document.getElementById("deleteNoteBtn");
  const notesList = document.getElementById("notesList");
  const notesEmptyState = document.getElementById("notesEmptyState");
  const noteTitle = document.getElementById("noteTitle");
  const noteContent = document.getElementById("noteContent");
  const searchInput = document.getElementById("searchInput");
  const editorPlaceholder = document.getElementById("editorPlaceholder");
  const saveStatus = document.getElementById("saveStatus");

  let currentNoteId = null;
  let allNotes = [];

  // Helpers
  function showEditor() {
    if (!editor) return;
    editor.classList.remove("hidden");
    if (editorPlaceholder) {
      editorPlaceholder.style.display = "none";
    }
  }

  function hideEditor() {
    if (!editor) return;
    editor.classList.add("hidden");
    if (editorPlaceholder) {
      editorPlaceholder.style.display = "block";
    }
    currentNoteId = null;
    noteTitle.value = "";
    noteContent.value = "";
    clearActiveNote();
  }

  function setStatus(msg, type = "info") {
    if (!saveStatus) return;
    saveStatus.textContent = msg;
    saveStatus.className = `status-text status-${type}`;
    if (msg) {
      setTimeout(() => {
        saveStatus.textContent = "";
        saveStatus.className = "status-text";
      }, 2000);
    }
  }

  function clearActiveNote() {
    document
      .querySelectorAll(".note-item.active")
      .forEach((el) => el.classList.remove("active"));
  }

  function makeNoteCard(note) {
    const div = document.createElement("div");
    div.classList.add("note-item");
    div.dataset.id = note._id;

    const titleEl = document.createElement("div");
    titleEl.classList.add("note-item-title");
    titleEl.textContent = note.title || "(Untitled)";

    const metaEl = document.createElement("div");
    metaEl.classList.add("note-item-meta");
    if (note.createdAt) {
      const date = new Date(note.createdAt);
      metaEl.textContent = date.toLocaleString();
    } else {
      metaEl.textContent = "";
    }

    const snippetEl = document.createElement("div");
    snippetEl.classList.add("note-item-snippet");
    const snippet = (note.content || "").replace(/\s+/g, " ").trim();
    snippetEl.textContent =
      snippet.length > 80 ? snippet.slice(0, 80) + "…" : snippet;

    div.appendChild(titleEl);
    div.appendChild(metaEl);
    div.appendChild(snippetEl);

    div.addEventListener("click", () => {
      currentNoteId = note._id;
      noteTitle.value = note.title || "";
      noteContent.value = note.content || "";
      showEditor();
      clearActiveNote();
      div.classList.add("active");
    });

    return div;
  }

  function renderNotes(list) {
    if (!notesList) return;
    notesList.innerHTML = "";

    if (!list || list.length === 0) {
      if (notesEmptyState) {
        notesEmptyState.style.display = "block";
        notesList.appendChild(notesEmptyState);
      }
      return;
    }

    if (notesEmptyState) {
      notesEmptyState.style.display = "none";
    }

    list.forEach((note) => {
      notesList.appendChild(makeNoteCard(note));
    });
  }

  // Load notes from backend
  async function loadNotes() {
    try {
      const res = await fetch("/api/notes");
      const notes = await res.json();
      allNotes = notes;
      renderNotes(allNotes);
    } catch (err) {
      console.error("Error loading notes:", err);
      setStatus("Failed to load notes.", "error");
    }
  }

  // NEW NOTE button
  if (newNoteBtn) {
    newNoteBtn.addEventListener("click", () => {
      currentNoteId = null;
      noteTitle.value = "";
      noteContent.value = "";
      showEditor();
      clearActiveNote();
      noteTitle.focus();

      newNoteBtn.classList.add("active");
      setTimeout(() => newNoteBtn.classList.remove("active"), 200);
    });
  }

  // SAVE NOTE
  if (saveNoteBtn) {
    saveNoteBtn.addEventListener("click", async () => {
      const title = noteTitle.value.trim();
      const content = noteContent.value.trim();

      if (!title || !content) {
        alert("Please enter both a title and content before saving.");
        return;
      }

      const noteData = { title, content };

      try {
        const method = currentNoteId ? "PUT" : "POST";
        const url = currentNoteId
          ? `/api/notes/${currentNoteId}`
          : `/api/notes`;

        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(noteData),
        });

        if (!response.ok) throw new Error("Save failed");

        const savedNote = await response.json();
        setStatus("Saved!", "success");

        // Refresh list and keep the saved note selected
        await loadNotes();

        // Find and mark active in the refreshed list
        const newActive = document.querySelector(
          `.note-item[data-id="${savedNote._id}"]`
        );
        if (newActive) {
          clearActiveNote();
          newActive.classList.add("active");
        }

        // If you REALLY want the editor to hide after saving, uncomment:
        // hideEditor();

      } catch (err) {
        console.error("Error saving note:", err);
        setStatus("Error saving note.", "error");
      }
    });
  }

  // DELETE NOTE
  if (deleteNoteBtn) {
    deleteNoteBtn.addEventListener("click", async () => {
      if (!currentNoteId) {
        alert("No note selected to delete.");
        return;
      }

      if (!confirm("Delete this note? This cannot be undone.")) return;

      try {
        const res = await fetch(`/api/notes/${currentNoteId}`, {
          method: "DELETE",
        });

        if (!res.ok) throw new Error("Delete failed");

        setStatus("Note deleted.", "success");
        hideEditor();
        await loadNotes();
      } catch (err) {
        console.error("Error deleting note:", err);
        setStatus("Error deleting note.", "error");
      }
    });
  }

  // SEARCH notes
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const term = e.target.value.toLowerCase();
      const filtered = allNotes.filter((note) => {
        const title = (note.title || "").toLowerCase();
        const content = (note.content || "").toLowerCase();
        return title.includes(term) || content.includes(term);
      });
      renderNotes(filtered);
    });
  }

  // Initial state
  hideEditor();
  loadNotes();
});
