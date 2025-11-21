const express = require("express");
const { markProgress } = require("../lib/progress");

const router = express.Router();

// Accept progress updates for the current session.
// Body: { flags: { ... }, codes: { ... } }
router.post("/", async (req, res) => {
  const sessionId = req.session?.userId;
  if (!sessionId) {
    return res.status(400).json({ error: "No session" });
  }

  const allowedFlags = [
    "reachedGateway",
    "solvedUsername",
    "solvedEmpathy",
    "solvedEmotion",
    "solvedEcho",
    "solvedDepth",
    "chosenEnding",
  ];
  const allowedCodes = ["reflection", "echo", "depth", "root"];

  const incomingFlags = req.body?.flags || {};
  const incomingCodes = req.body?.codes || {};

  const flags = {};
  const codes = {};

  allowedFlags.forEach((key) => {
    if (key in incomingFlags) flags[`flags.${key}`] = incomingFlags[key];
  });
  allowedCodes.forEach((key) => {
    if (key in incomingCodes) codes[`codes.${key}`] = incomingCodes[key];
  });

  const updates = { ...flags, ...codes };
  // Always store a session copy so Mission Control stays updated even if DB write fails.
  req.session.progress = req.session.progress || { flags: {}, codes: {} };
  Object.keys(flags).forEach((key) => {
    const shortKey = key.replace("flags.", "");
    req.session.progress.flags[shortKey] = flags[key];
  });
  Object.keys(codes).forEach((key) => {
    const shortKey = key.replace("codes.", "");
    req.session.progress.codes[shortKey] = codes[key];
  });

  let doc = null;
  try {
    doc = await markProgress(sessionId, updates);
  } catch (err) {
    console.error("Failed to update progress in DB; using session-only.", err);
  }
  res.json({ ok: true, progress: doc || req.session.progress });
});

module.exports = router;
