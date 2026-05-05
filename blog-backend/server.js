const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
  res.json({});
});

// GET all blogs
app.get('/blogs', (req, res) => {
  db.all('SELECT * FROM blogs ORDER BY createdAt DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET single blog
app.get('/blogs/:id', (req, res) => {
  db.get('SELECT * FROM blogs WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Blog not found' });
    res.json(row);
  });
});

// POST create blog
app.post('/blogs', (req, res) => {
  const { title, body } = req.body;
  if (!title || !body)
    return res.status(400).json({ error: 'Title and body are required' });

  const createdAt = new Date().toISOString();
  db.run(
    'INSERT INTO blogs (title, body, createdAt) VALUES (?, ?, ?)',
    [title, body, createdAt],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      db.get('SELECT * FROM blogs WHERE id = ?', [this.lastID], (err, row) => {
        res.status(201).json(row);
      });
    }
  );
});

// PUT update blog
app.put('/blogs/:id', (req, res) => {
  const { title, body } = req.body;
  db.run(
    'UPDATE blogs SET title = ?, body = ? WHERE id = ?',
    [title, body, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      db.get('SELECT * FROM blogs WHERE id = ?', [req.params.id], (err, row) => {
        if (!row) return res.status(404).json({ error: 'Blog not found' });
        res.json(row);
      });
    }
  );
});

// DELETE blog
app.delete('/blogs/:id', (req, res) => {
  db.run('DELETE FROM blogs WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Blog deleted' });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));