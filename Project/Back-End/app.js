const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const verifiedUsers = new Set();


// --- Middleware ---
app.use(express.json());
app.use(express.static(path.join(__dirname, '../front-end')));
app.use(cors());
app.use(bodyParser.json());

// --- Database Connection ---
mongoose.connect('mongodb://localhost:27017/notebook');

const NoteSchema = new mongoose.Schema({
  userId: String,
  content: String
});
const Note = mongoose.model('Note', NoteSchema);

app.post('/save', async (req, res) => {
  const { userId, content } = req.body;
  let note = await Note.findOne({ userId });
  if (!note) note = new Note({ userId, content });
  else note.content = content;
  await note.save();
  res.send({ status: 'ok' });
});

app.get('/note/:userId', async (req, res) => {
  const note = await Note.findOne({ userId: req.params.userId });
  res.send(note ? note : { content: '' });
});

// --- API Routes ---


// --- Start server ---
const PORT = process.env.PORT || 3030;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
