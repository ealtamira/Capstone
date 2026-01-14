require("dotenv").config();
const MongoStore = require("connect-mongo");
const express = require("express");
const session = require("express-session");
const expressLayouts = require('express-ejs-layouts');
const cors = require("cors");
const crypto = require("crypto");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();

// --- Session Setup ---  
app.use(
  session({
    secret: process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex"),
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI,  collectionName: "sessions" }),
  })
);

// Give each visitor a stable anonymous ID in their session
app.use((req, res, next) => {
  if (!req.session.userId) {
    req.session.userId =
      crypto.randomUUID?.() || crypto.randomBytes(16).toString("hex");
  }
  next();
});

// --- Core Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, "public")));

// --- Middleware ---
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("layout", "layouts/main");

// --- CORS Setup ---
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// --- Database Connection ---
const MONGO_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// --- API Routers ---
const notesRouter = require("./routes/notes");
const mirrorRouter = require("./routes/mirror");
const hubRouter = require("./routes/hub");
const progressRouter = require("./routes/progress");

app.use("/api/notes", notesRouter);
app.use("/mirror", mirrorRouter);
app.use("/", hubRouter);
app.use("/api/progress", progressRouter);

// --- Caesar Cipher API ---
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

  const decoded = caesarDecode(text || "", parseInt(shift) || 0);
  res.json({ result: decoded });
});

// ==============================
//     PAGE ROUTES (EJS)
// ==============================

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

app.get("/vigenere", (req, res) => { res.render("pages/vigenere", {
    layout: "layouts/main",
    title: "The Mirror | Vigenère Decoder",
    scripts: `<script src="/JS/pages/vigenere.js"></script>`,
    result: null, text: "", key: "" 
  });
});

app.get("/rot13", (req, res) => { res.render("pages/rot13", {
    layout: "layouts/main",
    title: "The Mirror | ROT13 Decoder",
    scripts: `<script src="/JS/pages/rot13.js"></script>`,
    result: null, text: "" 
  });
});

app.get("/base64", (req, res) => { res.render("pages/base64", {
    layout: "layouts/main",
    title: "The Mirror | Base64 Decoder",
    scripts: `<script src="/JS/pages/base64.js"></script>`,
    result: null, text: "" 
  });
});

app.get("/rail", (req, res) => { res.render("pages/rail", {
    layout: "layouts/main",
    title: "The Mirror | Rail Fence Tool",
    scripts: `<script src="/JS/pages/rail.js"></script>`,
    result: null, text: "", rails: 3 
  });
});

app.get("/image-editor", (req, res) => { res.render("pages/image-editor", {
    layout: "layouts/main",
    title: "The Mirror | Image Editor",
    scripts: `<script src="/JS/pages/image-editor.js"></script>`
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
