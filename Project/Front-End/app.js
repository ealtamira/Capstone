const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

// Serve static files (HTML, CSS, JS, etc.)
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

// Home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});

// Empathy review page
app.get("/appeal", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "appeal.html"));
});

// Hidden reflection page (puzzle)
app.get("/reflection", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "reflection.html"));
});

app.get("/gateway", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "gateway.html"));
});

app.get("/gateway-puzzle", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "gateway-puzzle.html"));
});

app.get("/username-puzzle", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "username-puzzle.html"));
});


// Optional ARG-style API clue route
app.get("/api/message", (req, res) => {
  res.json({ clue: "The truth hides in plain sight..." });

});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`✅ Server running at http://localhost:${PORT}`)
);
