const express = require('express');
const path = require('path');
const { analyzeCompetitorSite } = require('./competitorAnalysis');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

app.post('/api/analyze', async (req, res) => {
  try {
    const result = await analyzeCompetitorSite(req.body.url);
    res.json({ success: true, pages: result });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});