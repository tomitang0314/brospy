const express = require('express');
const path = require('path');
const { analyzeCompetitorSite } = require('./competitorAnalysis');
const handleFileUpload = require('./fileUploadHandler');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

app.post('/api/analyze', async (req, res) => {
  try {
    const result = await analyzeCompetitorSite(req.body.url);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/upload', handleFileUpload);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});