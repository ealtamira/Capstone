const express = require("express");
const expressLayouts = require('express-ejs-layouts');
const cors = require("cors");
const path = require("path");
const app = express();


// --- Middleware ---
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static('../Back-End'));
app.use(expressLayouts);
app.use(cors());

app.set('view engine', 'ejs');
app.set('layout', 'layouts/main'); 

// Home page
app.get("/", (req, res) => res.render("home"));

// Empathy review page
app.get("/appeal", (req, res) => res.render("appeal"));

// Hidden reflection page (puzzle)
app.get("/reflection", (req, res) => res.render("reflection"));

app.get("/gateway", (req, res) => res.render("gateway"));

app.get("/notebook", (req, res) => res.render("notebook"));

// Puzzle pages
app.get("/gateway-puzzle", (req, res) => res.render("gateway-puzzle"));

app.get("/username-puzzle", (req, res) => res.render("username-puzzle"));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`✅ Server running at http://localhost:${PORT}`)
);
