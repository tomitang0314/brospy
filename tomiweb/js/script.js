let currentPage = 'Home';
let currentPreviewMode = 'desktop';

let defaultPages = [
  {
    name: 'Home',
    content: '<h1>歡迎來到我們的線上博弈平台</h1>\n\n<p>這裡是您探索刺激和娛樂的最佳選擇。我們提供多樣化的遊戲選擇，確保每位玩家都能找到自己喜愛的遊戲類型。</p>\n\n<h2>我們的特色</h2>\n\n<ul>\n<li>豐富的遊戲選擇</li>\n<li>安全可靠的平台</li>\n<li>24/7 客戶支援</li>\n<li>優惠多多，回饋不斷</li>\n</ul>\n\n<h2>立即開始您的遊戲之旅</h2>\n\n<p>註冊即可獲得豐厚的歡迎獎金。開始您的線上博弈冒險吧！</p>'
  },
  {
    name: 'Games',
    content: '<h1>我們的遊戲</h1>\n\n<p>探索我們豐富多樣的遊戲世界：</p>\n\n<h2>老虎機</h2>\n<p>從經典三輪到最新的視頻老虎機，應有盡有。</p>\n\n<h2>撲克</h2>\n<p>德州撲克、奧瑪哈等多種玩法，適合各種級別的玩家。</p>\n\n<h2>輪盤</h2>\n<p>歐洲輪盤、美式輪盤，體驗不同的刺激。</p>\n\n<h2>百家樂</h2>\n<p>簡單易懂，深受玩家喜愛的經典遊戲。</p>'
  },
  {
    name: 'Promotions',
    content: '<h1>優惠活動</h1>\n\n<p>在我們的平台，精彩優惠不斷！</p>\n\n<h2>新玩家歡迎獎金</h2>\n<p>首存最高可獲 100% 獎金，最高可達 $1000。</p>\n\n<h2>每週返水</h2>\n<p>每週享受高達 1% 的返水優惠。</p>\n\n<h2>VIP 計劃</h2>\n<p>成為 VIP 會員，享受專屬優惠和個人管家服務。</p>\n\n<h2>節日特別活動</h2>\n<p>在重要節日期間，我們會推出特別的優惠活動。敬請關注！</p>'
  }
];

let pages = [...defaultPages];

function switchPreviewMode(mode) {
  currentPreviewMode = mode;
  updatePreview();
}

function updatePageList() {
  console.log('更新页面列表');
  const pageList = document.getElementById('pageList');
  pageList.innerHTML = '';
  pages.forEach((page, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="page-item">
        <span>${page.name}</span>
        <div>
          <button class="edit-btn">編輯</button>
          ${index !== 0 ? `<button class="remove-btn">刪除</button>` : ''}
        </div>
      </div>
      <div class="edit-area hidden">
        <input type="text" class="edit-page-name" value="${page.name}">
        <textarea class="edit-page-content">${page.content}</textarea>
        <button class="save-btn">保存</button>
        <button class="cancel-btn">取消</button>
      </div>
    `;
    pageList.appendChild(li);

    const editBtn = li.querySelector('.edit-btn');
    const removeBtn = li.querySelector('.remove-btn');
    const saveBtn = li.querySelector('.save-btn');
    const cancelBtn = li.querySelector('.cancel-btn');

    editBtn.addEventListener('click', () => editPage(index));
    if (removeBtn) {
      removeBtn.addEventListener('click', () => removePage(index));
    }
    saveBtn.addEventListener('click', () => savePage(index));
    cancelBtn.addEventListener('click', () => cancelEdit(index));
  });
  console.log('页面列表更新完成');
}

function updatePreview() {
  console.log('更新预览，当前页面:', currentPage, '预览模式:', currentPreviewMode);
  const currentPageContent = pages.find(p => p.name === currentPage)?.content || '';
  const previewContainer = document.getElementById('preview');
  
  let previewClass = currentPreviewMode === 'mobile' ? 'mobile-preview' : 'desktop-preview';
  
  previewContainer.innerHTML = `
      <div class="${previewClass}">
          <div class="${document.getElementById('theme').value}">
              <header>
                  <h1>${document.getElementById('siteName').value || '我的線上博弈網站'}</h1>
                  <nav>
                      <ul>
                          ${pages.map(p => `<li><a href="#" onclick="changePage('${p.name}'); return false;">${p.name}</a></li>`).join('')}
                      </ul>
                  </nav>
              </header>
              <main>
                  ${currentPageContent}
              </main>
              <footer>
                  <p>&copy; 2024 ${document.getElementById('siteName').value || '我的線上博弈網站'}. All rights reserved.</p>
              </footer>
          </div>
      </div>
  `;
  console.log('预览更新完成');
}

function addPage() {
  const newPageName = document.getElementById('newPageName').value.trim();
  if (newPageName && !pages.some(page => page.name === newPageName)) {
    pages.push({
      name: newPageName,
      content: `<h1>${newPageName}</h1>\n\n<p>這是 ${newPageName} 頁面的內容。</p>`
    });
    updatePageList();
    document.getElementById('newPageName').value = '';
    updatePreview();
  } else {
    alert('請輸入有效的頁面名稱且不要重複');
  }
}

function removePage(index) {
  if (confirm('確定要刪除這個頁面嗎？')) {
    pages.splice(index, 1);
    updatePageList();
    updatePreview();
  }
}

function editPage(index) {
  const pageItem = document.querySelectorAll('#pageList li')[index];
  const editArea = pageItem.querySelector('.edit-area');
  const pageItemContent = pageItem.querySelector('.page-item');
  editArea.classList.remove('hidden');
  pageItemContent.classList.add('hidden');
}

function savePage(index) {
  const pageItem = document.querySelectorAll('#pageList li')[index];
  const newName = pageItem.querySelector('.edit-page-name').value.trim();
  const newContent = pageItem.querySelector('.edit-page-content').value;
  
  if (newName && (index === 0 || !pages.some((page, i) => i !== index && page.name === newName))) {
    pages[index].name = newName;
    pages[index].content = newContent;
    updatePageList();
    updatePreview();
  } else {
    alert('請輸入有效的頁面名稱且不要重複');
  }
}

function cancelEdit(index) {
  const pageItem = document.querySelectorAll('#pageList li')[index];
  const editArea = pageItem.querySelector('.edit-area');
  const pageItemContent = pageItem.querySelector('.page-item');
  editArea.classList.add('hidden');
  pageItemContent.classList.remove('hidden');
}

function changePage(pageName) {
  console.log('切换页面到:', pageName);
  currentPage = pageName;
  updatePreview();
}

function resetToDefaults() {
  pages = [...defaultPages];
  currentPage = 'Home';
  updatePageList();
  updatePreview();
}

function uploadFile() {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];

  if (!file) {
    document.getElementById('message').textContent = '請選擇一個文件。';
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  fetch('/upload', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      document.getElementById('message').textContent = '文件上傳成功。';
      if (data.pages) {
        pages = data.pages;
        updatePageList();
        updatePreview();
      }
    } else {
      document.getElementById('message').textContent = '文件上傳失敗：' + (data.message || '未知錯誤');
    }
  })
  .catch(error => {
    console.error('Upload error:', error);
    document.getElementById('message').textContent = '上傳過程中發生錯誤：' + error.message;
  });
}

function analyzeCompetitor() {
  const url = document.getElementById('competitorUrl').value.trim();
  if (!url) {
    document.getElementById('analysisMessage').textContent = '請輸入有效的競品網址';
    return;
  }

  document.getElementById('analysisMessage').textContent = '開始分析...';
  document.getElementById('analysisProgress').style.display = 'block';

  fetch('/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ url })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success && data.pages) {
      displayResult(data.pages);
    } else {
      throw new Error(data.message || '分析失败');
    }
  })
  .catch(error => {
    console.error('分析错误:', error);
    document.getElementById('analysisMessage').textContent = '發生錯誤: ' + (error.message || '未知错误');
    document.getElementById('analysisProgress').style.display = 'none';
  });
}

function displayResult(result) {
  console.log('接收到的分析结果:', result);
  pages = result.map(page => ({
    name: page['Page Name'],
    content: page['Content']
  }));
  updatePageList();
  if (pages.length > 0) {
    currentPage = pages[0].name;
    updatePreview();
  }
  document.getElementById('analysisMessage').textContent = '分析完成，页面已更新';
  document.getElementById('analysisProgress').style.display = 'none';
}

async function generateAndDownloadSite() {
  try {
    const zip = new window.JSZip();

    pages.forEach(page => {
      const fileName = `${page.name.toLowerCase().replace(/\s+/g, '-')}.html`;
      zip.file(fileName, page.content);
    });

    const content = await zip.generateAsync({type: "blob"});
    window.saveAs(content, "website.zip");

  } catch (error) {
    console.error("生成網站時出錯:", error);
    alert("生成網站時出錯，請查看控制台以獲取更多信息。");
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', function() {
      this.parentElement.classList.toggle('active');
    });
  });

  updatePageList();
  updatePreview();

  // 添加新的事件監聽器
  const desktopPreviewBtn = document.querySelector('button[onclick="switchPreviewMode(\'desktop\')"]');
  const mobilePreviewBtn = document.querySelector('button[onclick="switchPreviewMode(\'mobile\')"]');

  if (desktopPreviewBtn) {
      desktopPreviewBtn.addEventListener('click', () => switchPreviewMode('desktop'));
  }
  if (mobilePreviewBtn) {
      mobilePreviewBtn.addEventListener('click', () => switchPreviewMode('mobile'));
  }

  updatePreview(); // 初始化預覽
});