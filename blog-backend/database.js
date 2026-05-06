const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

pool.query(`
  CREATE TABLE IF NOT EXISTS blogs (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    "createdAt" TEXT NOT NULL
  )
`).then(() => {
  console.log('PostgreSQL connected and table ready');
}).catch(err => {
  console.error('DB init error:', err.message);
});

module.exports = pool;