const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

// GET 
app.get('/blogs', (req, res) => {
  const blogs = db.prepare('SELECT * FROM blogs ORDER BY createdAt DESC').all();
  res.json(blogs);
});

// GET single blog
app.get('/blogs/:id', (req, res) => {
  const blog = db.prepare('SELECT * FROM blogs WHERE id = ?').get(req.params.id);
  if (!blog) return res.status(404).json({ error: 'Blog not found' });
  res.json(blog);
});

// POST create blog
app.post('/blogs', (req, res) => {
  const { title, body } = req.body;
  if (!title || !body)
    return res.status(400).json({ error: 'Title and body are required' });

  const result = db
    .prepare('INSERT INTO blogs (title, body, createdAt) VALUES (?, ?, ?)')
    .run(title, body, new Date().toISOString());

  const blog = db.prepare('SELECT * FROM blogs WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(blog);
});

// PUT update blog
app.put('/blogs/:id', (req, res) => {
  const { title, body } = req.body;
  const blog = db.prepare('SELECT * FROM blogs WHERE id = ?').get(req.params.id);
  if (!blog) return res.status(404).json({ error: 'Blog not found' });

  db.prepare('UPDATE blogs SET title = ?, body = ? WHERE id = ?').run(
    title,
    body,
    req.params.id
  );

  const updated = db.prepare('SELECT * FROM blogs WHERE id = ?').get(req.params.id);
  res.json(updated);
});

// DELETE blog
app.delete('/blogs/:id', (req, res) => {
  const blog = db.prepare('SELECT * FROM blogs WHERE id = ?').get(req.params.id);
  if (!blog) return res.status(404).json({ error: 'Blog not found' });

  db.prepare('DELETE FROM blogs WHERE id = ?').run(req.params.id);
  res.json({ message: 'Blog deleted' });
});

app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
  res.json({});
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));