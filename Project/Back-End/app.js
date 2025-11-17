const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');


const notesRouter = require("./Scripts/routes/notes");
const mirrorRouter = require('./routes/mirror');
const finalRouter = require('./routes/final');

// -- Session Setup ---
app.use(session({
  secret: 'replace-with-strong-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // set secure:true if using https
}));



// --- Middleware ---
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// --- Database Connection ---
mongoose
  .connect("mongodb://127.0.0.1:27017/notebookDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

// --- Routes ---

app.use("/api/notes", notesRouter);
app.use('/mirror', mirrorRouter);
app.use('/final', finalRouter);


// --- API Routes ---
app.post("/decode", (req, res) => {
  const { text, shift } = req.body;

  function caesarDecode(str, shift) {
    const a = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return str
      .toUpperCase()
      .split("")
      .map((char) => {
        const index = a.indexOf(char);
        if (index === -1) return char;
        return a[(index - shift + 26) % 26];
      })
      .join("");
  }

  const decoded = caesarDecode(text, parseInt(shift) || 0);
  res.json({ result: decoded });
});

// --- Start server ---
const PORT = process.env.PORT || 3030;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
