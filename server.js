// server.js
const express = require('express');
const cors = require('cors');
const { fetchLatestResults } = require('./scraper');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/api/latest', async (req, res) => {
  try {
    const results = await fetchLatestResults();
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

app.get('/', (req, res) => {
  res.send('PCSO Lotto API is running. Access /api/latest for results.');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
