require('dotenv').config();
const express = require('express');
const { analyzeWebsite } = require('./competitorAnalysis'); // 引入 analyzeWebsite 函數

const app = express();
app.use(express.json());

app.post('/analyze', async (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ success: false, message: '未提供URL。' });
    }

    const taskId = Date.now().toString();
    const updateTask = (taskId, progress, status, detail) => {
        // 這裡可以添加更新任務狀態的邏輯
        console.log(`Task ${taskId}: ${progress}% - ${status} - ${detail}`);
    };

    try {
        const pages = await analyzeWebsite(url, taskId, updateTask);
        res.json({ success: true, pages });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
