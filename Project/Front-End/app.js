const express = require("express");
const expressLayouts = require('express-ejs-layouts');
const cors = require("cors");
const path = require("path");
const { Script } = require("vm");
const app = express();


// --- Middleware ---
app.use(express.static(path.join(__dirname, "public")));
app.use(expressLayouts);
app.use(cors());

app.set('view engine', 'ejs');
app.set('layout', 'layouts/main'); 

// Home page
app.get("/", (req, res) => res.render("pages/home", { 
  layout: "layouts/main",
  title: "The Mirror Initiative",
  scripts: `<script src="/JS/site.js"></script>`
}));

// Empathy review page
app.get("/appeal", (req, res) => res.render("pages/appeal", {
  layout: "layouts/main",
  title: "The Mirror | Empathy Review Portal",
  scripts: `<script src="/JS/pages/appeal.js"></script>`
}));

// Hidden reflection page (puzzle)
app.get("/reflection", (req, res) => res.render("pages/reflection", {
  layout: "layouts/main",
  title: "The Mirror | Reflection Node",
}));

app.get("/gateway", (req, res) => res.render("pages/gateway", {
  layout: "layouts/main",
  title: "The Mirror | Access Gateway",
  scripts: `<script src="/JS/pages/gateway.js"></script>`
}));

app.get("/notebook", (req, res) => res.render("pages/notebook", {
  layout: "layouts/main",
  title: "The Mirror | Research Notebook",
  scripts: `<script src="/JS/pages/notebook.js"></script>`
}));

app.get("/ceasercipher", (req, res) => { res.render("pages/ceasercipher", {
    layout: "layouts/main",
    title: "The Mirror | Cipher Tool",
    scripts: `<script src="/JS/pages/ceasercipher.js"></script>`,
    result: null, text: "", shift: "" 
  });
});

// Final act: root choice / endings
app.get("/final", (req, res) => {
  res.render("pages/final-choice", {
    layout: "layouts/main",
    title: "The Mirror | Final Reflection",
    scripts: `<script src="/JS/pages/final-choice.js"></script>`
  });
});

app.get("/final-disconnect", (req, res) => {
  res.render("pages/final-disconnect", {
    layout: "layouts/main",
    title: "The Mirror | Disconnected",
    scripts: ""
  });
});

app.get("/final-submit", (req, res) => {
  res.render("pages/final-submit", {
    layout: "layouts/main",
    title: "The Mirror | Absorbed",
    scripts: ""
  });
});

app.get("/final-deceive", (req, res) => {
  res.render("pages/final-deceive", {
    layout: "layouts/main",
    title: "The Mirror | Ghost Copy",
    scripts: ""
  });
});


// Puzzle pages
app.get("/gateway-puzzle", (req, res) => res.render("pages/gateway-puzzle", {
  layout: "layouts/main",
  title: "The Mirror | Alignment Puzzle",
  scripts: `<script src="/JS/pages/gateway-puzzle.js"></script>`
}));

app.get("/username-puzzle", (req, res) => res.render("pages/username-puzzle", {
  layout: "layouts/main",
  title: "The Mirror | Cryptography Puzzle",
  scripts: `<script src="/JS/pages/username-puzzle.js"></script>`
}));

app.get("/empathy-test", (req, res) => res.render("pages/empathy-test", {
    layout: "layouts/main",
    title: "The Mirror | Empathy Calibration Test",
    scripts: `<script src="/JS/pages/empathy-test.js"></script>`
  }));

app.get("/emotion-sorting", (req, res) => res.render("pages/emotion-sorting", {
    layout: "layouts/main",
    title: "The Mirror | Emotion Sorting Algorithm",
    scripts: `<script src="/JS/pages/emotion-sorting.js"></script>`
  }));

app.get("/echo-index", (req, res) => { res.render("pages/echo-index", {
    layout: "layouts/main",
    title: "The Mirror | Echo Labyrinth",
    scripts: `<script src="/JS/pages/echo-index.js"></script>`
  });
});

app.get("/depth-trace", (req, res) => { res.render("pages/depth-trace", {
    layout: "layouts/main",
    title: "The Mirror | Depth Trace",
    scripts: `<script src="/JS/pages/depth-trace.js"></script>`
  });
});


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`✅ Server running at http://localhost:${PORT}`)
);
