const express = require("express");
const Note = require("../model/Note");
const router = express.Router();

// Update note
router.put("/:id", async (req, res) => {
  try {
    const { title, content } = req.body;
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true } // return the updated note
    );
    if (!updatedNote) return res.status(404).json({ message: "Note not found" });
    res.json(updatedNote);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all notes
router.get("/", async (req, res) => {
  const notes = await Note.find().sort({ createdAt: -1 });
  res.json(notes);
});

// Save new note
router.post("/", async (req, res) => {
  const { title, content } = req.body;
  const newNote = new Note({ title, content });
  await newNote.save();
  res.json(newNote);
});

// Delete note
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Note.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Note not found" });
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
