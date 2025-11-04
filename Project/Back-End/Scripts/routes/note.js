const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");

module.exports = (db) => {
  const notes = db.collection("notes");

  // Get all notes
  router.get("/getNotes", async (req, res) => {
    const allNotes = await notes.find({}).toArray();
    res.json(allNotes);
  });

  // Save or update a note
  router.post("/saveNote", async (req, res) => {
    const { id, title, content } = req.body;
    if (id) {
      await notes.updateOne(
        { _id: new ObjectId(id) },
        { $set: { title, content } }
      );
    } else {
      await notes.insertOne({ title, content, createdAt: new Date() });
    }
    res.json({ success: true });
  });

  // Delete note
  router.delete("/deleteNote/:id", async (req, res) => {
    await notes.deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ success: true });
  });

  return router;
};
