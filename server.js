const express = require('express');
const db = require('./config/database');

const app = express();
app.use(express.json());

app.get('/api/health', async (req, res) => {
  try {
    const result = await db.query('SELECT version()');
    res.json({ 
      status: 'healthy', 
      postgres: result.rows[0].version,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM test_table ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
