require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');
const { Server } = require('ws');
const http = require('http');
const handleFileUpload = require('./fileUploadHandler');
const { analyzeCompetitorSite } = require('./competitorAnalysis');
const { PAGE_REGEX, OUTPUT_FORMATS } = require('./config');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// 確保上傳目錄存在
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir);
}

// 靜態文件服務
app.use(express.static('tomiweb'));

// 只在 /upload 路由使用 fileUpload 中間件
const upload = fileUpload({
  createParentPath: true,
  limits: { 
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  debug: false,
});

app.use(express.json());

// 文件上傳路由
app.post('/upload', upload, (req, res) => {
  console.log('Received file upload request');
  handleFileUpload(req, res);
});

const analysisTasks = new Map();

function createTask(taskId) {
  analysisTasks.set(taskId, {
    progress: 0,
    status: '初始化分析任務...',
    details: []
  });
}

app.post('/analyze', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ success: false, message: '未提供URL。' });
  }

  console.log(`收到分析請求，URL: ${url}`);
  const taskId = Date.now().toString();
  createTask(taskId);

  try {
    updateTask(taskId, 10, '開始分析網站', url);
    const result = await analyzeCompetitorSite(url);
    updateTask(taskId, 50, '分析完成，正在處理結果', '');
    console.log('AI 分析結果:', result);
    if (!result || result.length === 0) {
      throw new Error('分析完成，但未返回有效結果');
    }
    updateTask(taskId, 100, '分析成功', '生成了 ' + result.length + ' 個頁面');
    res.json({ success: true, pages: result, taskId });
  } catch (error) {
    console.error(`分析網站時出錯: ${error.message}`);
    updateTask(taskId, 100, '分析失敗', error.message);
    res.status(500).json({ success: false, message: error.message, taskId });
  }
});

function updateTask(taskId, progress, status, detail) {
  console.log(`Task ${taskId}: Progress ${progress}%, Status: ${status}, Detail: ${detail}`);
  const task = analysisTasks.get(taskId);
  if (task) {
    task.progress = progress;
    task.status = status;
    task.details.push(detail);
    broadcastUpdate(taskId, progress, status, detail);
  }
}

function broadcastUpdate(taskId, progress, status, detail) {
  const message = JSON.stringify({ taskId, progress, status, detail });
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// 創建 HTTP 服務器
const server = http.createServer(app);

// 創建 WebSocket 服務器
const wss = new Server({ server });

// WebSocket 連接處理
wss.on('connection', (ws) => {
  console.log('WebSocket client connected');
  
  ws.on('message', (message) => {
    console.log('Received:', message);
    // 處理接收到的消息
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

// 啟動服務器
server.listen(port, () => {
  console.log(`伺服器運行在 http://localhost:${port}`);
});

server.timeout = 600000; // 設置為 10 分鐘