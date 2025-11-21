const express = require("express");
const Note = require("../model/Note");

const router = express.Router();

// Get all notes for THIS session
router.get("/", async (req, res) => {
  try {
    const sessionId = req.session?.userId;
    const query = sessionId ? { sessionId } : {};

    const notes = await Note.find(query).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error("Error fetching notes:", err);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

// Create a new note for THIS session
router.post("/", async (req, res) => {
  try {
    const sessionId = req.session?.userId;
    const { title, content } = req.body;

    const newNote = new Note({
      title,
      content,
      sessionId: sessionId || null,
    });

    await newNote.save();
    res.json(newNote);
  } catch (err) {
    console.error("Error creating note:", err);
    res.status(500).json({ error: "Failed to create note" });
  }
});

// Update a note that belongs to THIS session
router.put("/:id", async (req, res) => {
  try {
    const sessionId = req.session?.userId;
    const { id } = req.params;
    const { title, content } = req.body;

    const filter = sessionId ? { _id: id, sessionId } : { _id: id };

    const updatedNote = await Note.findOneAndUpdate(
      filter,
      { title, content },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json(updatedNote);
  } catch (err) {
    console.error("Error updating note:", err);
    res.status(500).json({ error: "Failed to update note" });
  }
});

// Delete a note that belongs to THIS session
router.delete("/:id", async (req, res) => {
  try {
    const sessionId = req.session?.userId;
    const { id } = req.params;

    const filter = sessionId ? { _id: id, sessionId } : { _id: id };

    const deleted = await Note.findOneAndDelete(filter);

    if (!deleted) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json({ message: "Note deleted" });
  } catch (err) {
    console.error("Error deleting note:", err);
    res.status(500).json({ error: "Failed to delete note" });
  }
});

module.exports = router;
