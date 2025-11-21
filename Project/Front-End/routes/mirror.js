const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();
const DATA_PATH = path.join(__dirname, '..', 'data', 'mirrorData.json');

function loadData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  } catch (e) {
    console.error('Failed to load mirror data:', e);
    return {};
  }
}

// GET /mirror/emotions
// Renders the emotion dataset puzzle page
router.get('/emotions', (req, res) => {
  const data = loadData();
  // Pass emotion files to the view
  res.render('mirror-emotions', {
    title: 'Mirror — Emotion Files',
    emotions: data.emotionFiles || [],
    user: req.session?.user || null
  });
});

// GET /mirror/simulation
// Renders the simulation page where the Mirror shows predicted messages
router.get('/simulation', (req, res) => {
  const data = loadData();

  // Example: choose a random simulation fragment to show
  const fragments = data.simulationFragments || [];
  const fragment = fragments[Math.floor(Math.random() * Math.max(1, fragments.length))];

  // Provide a `predictions` object to the view so front-end can animate "predicted" text
  res.render('mirror-simulation', {
    title: 'Mirror — Simulation',
    fragment,
    user: req.session?.user || null
  });
});

module.exports = router;
