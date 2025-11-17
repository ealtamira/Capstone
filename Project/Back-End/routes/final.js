const express = require('express');
const router = express.Router();

// GET /final  -> show choices
router.get('/', (req, res) => {
  res.render('final-choice', {
    title: 'Final Reflection',
    user: req.session?.user || null
  });
});

// POST /final/choice  -> accept user's final decision
router.post('/choice', (req, res) => {
  const choice = req.body.choice;
  // Minimal handling — in a real ARG you might log this, update DB, or return different endings.

  if (choice === 'disconnect') {
    // destroy session (simulate deletion)
    if (req.session) {
      req.session.destroy(() => {});
    }
    return res.render('final-disconnect', { title: 'Disconnected' });
  }

  if (choice === 'submit') {
    // mark absorbed
    if (!req.session) req.session = {};
    req.session.absorbed = true;
    return res.render('final-submit', { title: 'Absorbed' });
  }

  if (choice === 'deceive') {
    // trick: create a "copy" flag and redirect to a subtly corrupted homepage
    if (!req.session) req.session = {};
    req.session.copy = true;
    return res.render('final-deceive', { title: 'Deceived' });
  }

  // default fallback
  res.redirect('/');
});

module.exports = router;
