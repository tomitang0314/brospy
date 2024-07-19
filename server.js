require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');
const http = require('http');
const handleFileUpload = require('./fileUploadHandler');
const { analyzeCompetitorSite } = require('./competitorAnalysis');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// 确保上传目录存在
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// 静态文件服务
app.use(express.static(path.join(__dirname, 'tomiweb')));
app.use(express.json());

// 文件上传路由
app.post('/upload', fileUpload(), (req, res) => {
    console.log('Received file upload request');
    handleFileUpload(req, res);
});

// 分析路由
app.post('/analyze', async (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ success: false, message: '未提供URL。' });
    }

    console.log(`收到分析请求，URL: ${url}`);
    try {
        const result = await analyzeCompetitorSite(url);
        console.log('AI 分析结果:', result);
        if (!result || result.length === 0) {
            throw new Error('分析完成，但未返回有效结果');
        }
        res.json({ success: true, pages: result });
    } catch (error) {
        console.error(`分析网站时出错: ${error.message}`);
        res.status(500).json({ success: false, message: error.message });
    }
});

// 返回其他请求的 index.html 文件
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'tomiweb', 'index.html'));
});

// 创建 HTTP 服务器
const server = http.createServer(app);

// 启动服务器
server.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
});

server.timeout = 600000; // 设置为 10 分钟
