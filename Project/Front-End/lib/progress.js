const Progress = require("../model/Progress");

async function getProgress(sessionId) {
  if (!sessionId) return null;
  try {
    let doc = await Progress.findOne({ sessionId });
    if (!doc) {
      doc = await Progress.create({ sessionId });
    }
    return doc;
  } catch (err) {
    console.error("Progress lookup failed; falling back to session-only", err);
    return null;
  }
}

async function markProgress(sessionId, updates) {
  if (!sessionId) return null;
  try {
    return await Progress.findOneAndUpdate(
      { sessionId },
      { $set: updates, $currentDate: { updatedAt: true } },
      { upsert: true, new: true }
    );
  } catch (err) {
    console.error("Progress persist failed; fallback to session-only", err);
    return null;
  }
}

module.exports = { getProgress, markProgress };
