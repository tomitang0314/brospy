// config.js
module.exports = {
  PAGE_REGEX: /### Page Name: (.+)\nContent:\n```html\n([\s\S]+?)```/g,
  OUTPUT_FORMATS: {
    default: {
      template: `
### Page Name: [页面名称]
Content: 
\`\`\`html
<h1>[主标题]</h1>
[其他 HTML 内容，包括 <p>, <ul>, <li> 等标签]
\`\`\`
      `,
      description: "默认的页面输出格式"
    },
    seoOptimized: {
      template: `
### Page Name: [页面名称]
Content:
\`\`\`html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[SEO优化的标题]</title>
  <meta name="description" content="[Meta描述]">
  <meta name="keywords" content="[关键词1], [关键词2], [关键词3]">
</head>
<body>
  <h1>[主标题]</h1>
  [主要内容，使用适当的HTML标签]
</body>
</html>
\`\`\`
      `,
      description: "SEO优化的页面输出格式",
      additionalFields: ["meta-description", "meta-keywords"]
    }
  }
};