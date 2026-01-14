const express = require("express");
const path = require("path");
const fs = require("fs");

const router = express.Router();
const INTEL_PATH = path.join(__dirname, "..", "data", "intel.json");

router.get("/mission-control", async (req, res) => {
  let progressDoc = null;
  try {
    // Fetch progress from backend API
    const response = await fetch("http://localhost:3001/api/progress", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      progressDoc = await response.json();
    }
  } catch (err) {
    console.error("Failed to fetch progress from backend:", err);
  }

  const sessionProgress = req.session?.progress || {};
  const flags = {
    ...(progressDoc?.flags || {}),
    ...(sessionProgress.flags || {}),
  };
  const codes = {
    ...(progressDoc?.codes || {}),
    ...(sessionProgress.codes || {}),
  };
  res.render("pages/mission-control", {
    layout: "layouts/main",
    title: "The Mirror | Mission Control",
    progress: flags,
    codes,
  });
});

router.get("/intel", (req, res) => {
  let intel = [];
  try {
    intel = JSON.parse(fs.readFileSync(INTEL_PATH, "utf8"));
  } catch (err) {
    console.error("Failed to load intel entries:", err);
  }

  res.render("pages/intel", {
    layout: "layouts/main",
    title: "The Mirror | Intel Archive",
    intel,
  });
});

module.exports = router;
