require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./database');

const app = express();
app.use(cors({
  origin: [
    'https://blog-app-phi-rosy.vercel.app',
    'https://blog-6uq8yuyb7-shani06012006-uis-projects.vercel.app',
    'http://localhost:5173'
  ]
}));

app.use(express.json());

app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
  res.json({});
});

app.get('/blogs', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM blogs ORDER BY "createdAt" DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/blogs/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM blogs WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Blog not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/blogs', async (req, res) => {
  const { title, body } = req.body;
  if (!title || !body) return res.status(400).json({ error: 'Title and body are required' });
  try {
    const createdAt = new Date().toISOString();
    const result = await pool.query(
      'INSERT INTO blogs (title, body, "createdAt") VALUES ($1, $2, $3) RETURNING *',
      [title, body, createdAt]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/blogs/:id', async (req, res) => {
  const { title, body } = req.body;
  try {
    const result = await pool.query(
      'UPDATE blogs SET title = $1, body = $2 WHERE id = $3 RETURNING *',
      [title, body, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Blog not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/blogs/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM blogs WHERE id = $1', [req.params.id]);
    res.json({ message: 'Blog deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));