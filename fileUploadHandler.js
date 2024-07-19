const path = require('path');
const xlsx = require('xlsx');
const fs = require('fs');

function handleFileUpload(req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ success: false, message: '沒有文件被上傳。' });
  }

  const file = req.files.file;
  if (!file) {
    return res.status(400).json({ success: false, message: '文件未在請求中找到。' });
  }

  const filePath = path.join(__dirname, 'uploads', file.name);

  file.mv(filePath, (err) => {
    if (err) {
      console.error('文件上傳失敗:', err);
      return res.status(500).json({ success: false, message: '文件上傳失敗。', error: err.message });
    }

    try {
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = xlsx.utils.sheet_to_json(worksheet);

      const pages = jsonData.map(row => ({
        name: row['Page Name'],
        content: row['Content']
      }));

      // 刪除臨時文件
      fs.unlinkSync(filePath);

      res.json({ success: true, pages: pages });
    } catch (error) {
      console.error('解析文件時出錯:', error);
      res.status(500).json({ success: false, message: '解析文件時出錯。', error: error.message });
    }
  });
}

module.exports = handleFileUpload;