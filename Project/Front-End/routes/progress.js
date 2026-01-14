const express = require("express");

const router = express.Router();

// Proxy progress updates to backend
router.post("/", async (req, res) => {
  try {
    const response = await fetch("http://localhost:3001/api/progress", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Failed to update progress on backend:", err);
    res.status(500).json({ error: "Failed to update progress" });
  }
});

module.exports = router;

