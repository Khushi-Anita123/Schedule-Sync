const express = require('express');
const fs = require('fs').promises;
const db=require('./middleware/db'); // Ensure this is set up correctly
const path = require('path');
const User = require('./models/user');
const app = express();
const PORT = 3000;
const router = require('./routers/index');
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Ensure data dir exists (helps on fresh clones)
const ensureDataDir = async () => {
  const dir = path.join(__dirname, 'data');
  try { await fs.mkdir(dir, { recursive: true }); } catch (e) {}
};

// JSON helpers shared via app.locals
const readJSON = async (file) => {
  try {
    const filePath = path.join(__dirname, 'data', file);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (err) {
    return [];
  }
};

const writeJSON = async (file, data) => {
  const filePath = path.join(__dirname, 'data', file);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};

app.locals.readJSON = readJSON;
app.locals.writeJSON = writeJSON;

app.use('/', router);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Signup.html'));
});

ensureDataDir().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});