const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  sessionId: { type: String, index: true },
  flags: {
    reachedGateway: { type: Boolean, default: false },
    solvedUsername: { type: Boolean, default: false },
    solvedEmpathy: { type: Boolean, default: false },
    solvedEmotion: { type: Boolean, default: false },
    solvedEcho: { type: Boolean, default: false },
    solvedDepth: { type: Boolean, default: false },
    chosenEnding: {
      type: String,
      enum: ["disconnect", "submit", "deceive", null],
      default: null,
    },
  },
  codes: {
    reflection: String,
    echo: String,
    depth: String,
    root: String,
  },
  updatedAt: { type: Date, default: Date.now },
});

progressSchema.index({ updatedAt: -1 });

module.exports = mongoose.model("Progress", progressSchema);
