require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');
const OpenAI = require('openai');
const { PAGE_REGEX, OUTPUT_FORMATS } = require('./config');
const puppeteer = require('puppeteer');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function fetchWebsiteContent(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto(url, { waitUntil: 'networkidle0' });

    const content = await page.evaluate(() => {
      const getTextContent = (selector) => {
        const element = document.querySelector(selector);
        return element ? element.textContent.trim() : '';
      };

      const getMultipleTextContent = (selector) => {
        return Array.from(document.querySelectorAll(selector)).map(el => el.textContent.trim());
      };

      const getLinkInfo = () => {
        return Array.from(document.querySelectorAll('a')).map(a => ({
          text: a.textContent.trim(),
          href: a.href
        }));
      };

      const getImageInfo = () => {
        return Array.from(document.querySelectorAll('img')).map(img => ({
          src: img.src,
          alt: img.alt
        }));
      };

      return {
        brandName: getTextContent('meta[property="og:site_name"]') || getTextContent('header .brand') || '',
        language: document.documentElement.lang || '',
        title: document.title,
        metaDescription: getTextContent('meta[name="description"]'),
        h1: getMultipleTextContent('h1'),
        h2: getMultipleTextContent('h2'),
        h3: getMultipleTextContent('h3'),
        h4: getMultipleTextContent('h4'),
        h5: getMultipleTextContent('h5'),
        h6: getMultipleTextContent('h6'),
        links: getLinkInfo(),
        images: getImageInfo(),
      };
    });

    await browser.close();
    return content;
  } catch (error) {
    console.error('Error fetching website content:', error);
    await browser.close();
    return null;
  }
}

function extractKeywords(content, limit = 5) {
  // 將所有文本轉換為小寫並分割成單詞
  const words = content.toLowerCase().split(/\W+/);
  
  // 計算詞頻
  const wordCounts = {};
  words.forEach(word => {
    if (word.length > 3) { // 忽略太短的詞
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    }
  });
  
  // 排序並選擇前N個關鍵字
  return Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([keyword, count]) => ({
      keyword,
      volume: count * 100, // 模擬搜索量
      traffic: count * 10, // 模擬流量
      position: Math.floor(Math.random() * 10) + 1 // 模擬排名
    }));
}

function getMockKeywords(url, limit = 10) {
  const mockKeywords = [
    { keyword: 'online betting', volume: 10000, traffic: 500, position: 1 },
    { keyword: 'sports betting', volume: 8000, traffic: 400, position: 2 },
    { keyword: 'casino games', volume: 7000, traffic: 350, position: 3 },
    { keyword: 'poker online', volume: 6000, traffic: 300, position: 4 },
    { keyword: 'slot machines', volume: 5000, traffic: 250, position: 5 },
    // ... 添加更多模擬關鍵字
  ];
  return mockKeywords.slice(0, limit);
}

function prepareAIPrompt(url, websiteContent, keywords) {
  const formatDescriptions = Object.entries(OUTPUT_FORMATS)
    .map(([key, format]) => `${key} format:\n${format.template}`)
    .join('\n\n');

  return `
Analyze the following website: ${url}

Actual content from the competitor's website:
Title: ${websiteContent.title}
Meta Description: ${websiteContent.metaDescription}
H1 Headers: ${websiteContent.h1.join(', ')}
H2 Headers: ${websiteContent.h2.join(', ')}
H3 Headers: ${websiteContent.h3.join(', ')}

Top 5 extracted keywords for this site:
${keywords.map(k => `- ${k.keyword} (Volume: ${k.volume}, Traffic: ${k.traffic}, Position: ${k.position})`).join('\n')}

Based on this specific content from the competitor's website, create 5 unique pages for a new website. Each page should directly reference and utilize the scraped elements while maintaining the original language (en-US). Do not use generic templates. Instead, create distinctive content that closely revolves around the specific features and themes of the competitor's website.

Use the following format for each page:

${formatDescriptions}

Ensure that each page content adheres to the following requirements:
1. Use the same language as the target website (en-US).
2. Each page must strictly follow one of the specified formats.
3. The content should be SEO-friendly, incorporating relevant keywords from the analysis.
4. Generate exactly 5 different pages, focusing on: Home Page, Online Betting, Casino Games, Live Casino Experience, and Mobile Gaming.
5. Each page's content should contain at least 1000 characters and use appropriate HTML tags.

Remember, the goal is to create content that is competitive and of high quality, leveraging the insights gained from the detailed website analysis. Do not invent information or use generic content unrelated to the analyzed website.
`;
}

// function prepareAIPrompt(url, websiteContent, keywords) {
//   const formatDescriptions = Object.entries(OUTPUT_FORMATS)
//     .map(([key, format]) => `${key} format:\n${format.template}`)
//     .join('\n\n');

//   return `
// Analyze the following website: ${url}

// Brand Name: ${websiteContent.brandName}
// Language: ${websiteContent.language}
// Title: ${websiteContent.title}
// Meta Description: ${websiteContent.metaDescription}

// Headers:
// H1: ${websiteContent.h1.join(', ')}
// H2: ${websiteContent.h2.join(', ')}
// H3: ${websiteContent.h3.join(', ')}
// H4: ${websiteContent.h4.join(', ')}
// H5: ${websiteContent.h5.join(', ')}
// H6: ${websiteContent.h6.join(', ')}

// Links:
// ${websiteContent.links.map(link => `- ${link.text}: ${link.href}`).join('\n')}

// Images:
// ${websiteContent.images.map(img => `- ${img.alt}: ${img.src}`).join('\n')}

// Top 5 organic keywords for this site:
// ${keywords.map(k => `- ${k.keyword} (Volume: ${k.volume}, Traffic: ${k.traffic}, Position: ${k.position})`).join('\n')}

// Based on this detailed content analysis, create exactly 5 SEO-friendly page contents suitable for a competing website. Each page should focus on a different aspect of the online casino experience, while maintaining a similar structure and competitive edge to the analyzed site.

// Each page must strictly follow one of these formats:

// ${formatDescriptions}

// Please ensure that each page content adheres to the following requirements:
// 1. Use the same language as the target website (${websiteContent.language}).
// 2. Each page must strictly follow one of the specified formats.
// 3. The HTML content in the Content field will be used directly as the page content.
// 4. Ensure that each page's content contains at least 1000 characters and uses appropriate HTML tags to structure the content.
// 5. The content should be SEO-friendly, including relevant keywords from the analysis, but avoid overuse.
// 6. Generate exactly 5 different pages, with each page separated by an empty line.
// 7. The content should be professional, engaging, and provide substantial value, closely matching the quality and style of the analyzed site.
// 8. Use the analyzed headers, links, and image descriptions to inform the structure and content of your generated pages.

// Generate 5 different pages, each focusing on a different aspect: Home Page, Online Betting, Casino Games, Live Casino Experience, and Mobile Gaming. Ensure that the content is competitive and of high quality, leveraging the insights gained from the detailed website analysis.
// `;
// }

async function callOpenAI(prompt) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 4000,
      temperature: 0.7,
    });
    
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
}

function parseAIResponse(response) {
  const pages = [];
  let match;

  while ((match = PAGE_REGEX.exec(response)) !== null) {
    if (match.length >= 3) {
      const pageName = match[1].trim();
      const content = match[2].trim();

      const page = {
        'Page Name': pageName,
        'Content': content
      };

      const formatConfig = OUTPUT_FORMATS[process.env.OUTPUT_FORMAT || 'default'];
      if (formatConfig.additionalFields) {
        formatConfig.additionalFields.forEach(field => {
          const fieldRegex = new RegExp(`<${field}>(.+?)</${field}>`, 's');
          const fieldMatch = content.match(fieldRegex);
          if (fieldMatch && fieldMatch[1]) {
            page[field] = fieldMatch[1].trim();
          }
        });
      }

      pages.push(page);
    }
  }

  if (pages.length === 0) {
    console.error('No valid pages found in AI response');
    console.log('AI Response:', response);
  }

  return pages;
}

async function analyzeCompetitorSite(url) {
  try {
    console.log(`開始分析競品網站: ${url}`);
    
    const websiteContent = await fetchWebsiteContent(url);
    if (!websiteContent) {
      throw new Error('無法獲取網站內容');
    }
    
    console.log('獲取到的網站內容:', websiteContent);
    
    // 將所有相關內容合併成一個字符串
    const allContent = `
      ${websiteContent.title}
      ${websiteContent.metaDescription}
      ${websiteContent.h1.join(' ')}
      ${websiteContent.h2.join(' ')}
      ${websiteContent.h3.join(' ')}
    `;
    
    const keywords = extractKeywords(allContent);
    console.log('提取的關鍵字:', keywords);
    
    const prompt = prepareAIPrompt(url, websiteContent, keywords);
    console.log('準備的 AI Prompt:', prompt);
    
    const aiResponse = await callOpenAI(prompt);
    console.log('AI 響應:', aiResponse);
    
    const generatedPages = parseAIResponse(aiResponse);
    console.log('生成的頁面:', generatedPages);
    
    if (!generatedPages || generatedPages.length === 0) {
      throw new Error('分析完成，但未返回有效結果');
    }
    
    return generatedPages;
  } catch (error) {
    console.error("分析競品網站時出錯:", error);
    throw error;
  }
}

module.exports = { analyzeCompetitorSite };