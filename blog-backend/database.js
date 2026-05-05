const Database = require('better-sqlite3');
const db = new Database('blogs.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS blogs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    createdAt TEXT NOT NULL
  )
`);

module.exports = db;