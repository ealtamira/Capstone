const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// --- Middleware ---
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  console.log(`[MIRROR-LOG] ${new Date().toISOString()} :: ${req.method} ${req.url}`);
  res.setHeader('X-MIRROR-SYSTEM', 'ACTIVE');
  next();
});

// --- Cipher Logic ---
function mirrorCipher(text) {
  return Buffer.from(
    text
      .split('')
      .map((ch, i) => String.fromCharCode(ch.charCodeAt(0) + (i % 5)))
      .join('')
  ).toString('base64');
}

// --- Memory store for verified sessions ---
const verifiedUsers = new Set();

// --- API Routes ---
app.post('/api/encode', (req, res) => {
  const { user } = req.body;
  if (!user) return res.status(400).json({ error: 'Missing user' });

  const encoded = mirrorCipher(user);
  res.json({ encoded });
});

app.post('/api/verify', (req, res) => {
  const { code } = req.body;

  if (code && code.trim().toUpperCase() === 'EIDOLON') {
    const token = mirrorCipher('verified_' + Date.now());
    verifiedUsers.add(token);
    return res.json({ 
      message: 'Access granted. Reflection found.',
      token 
    });
  }

  res.json({ message: 'Reflection invalid. Reassess empathy.' });
});

// --- Protected route for the reflection page ---
app.get('/reflection', (req, res) => {
  const token = req.query.token;

  if (!token || !verifiedUsers.has(token)) {
    return res.status(403).send(`
      <h1>ACCESS DENIED</h1>
      <p>Your reflection is not authorized.</p>
      <p>Hint: Verify your empathy alignment at /api/verify.</p>
    `);
  }

  res.sendFile(path.join(__dirname, 'public', 'reflection.html'));
});

app.get("/gateway", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "gateway.html"));
});


// --- Serve static files ---
app.use(express.static(path.join(__dirname, 'public')));

// --- Start server ---
const PORT = process.env.PORT || 3030;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
