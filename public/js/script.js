let currentPage = 'Home';
let currentPreviewMode = 'desktop';

let defaultPages = [
  {
    name: 'Home',
    content: '<h1>欢迎来到我们的线上博弈平台</h1>\n\n<p>这里是您探索刺激和娱乐的最佳选择。我们提供多样化的游戏选择，确保每位玩家都能找到自己喜爱的游戏类型。</p>\n\n<h2>我们的特色</h2>\n\n<ul>\n<li>丰富的游戏选择</li>\n<li>安全可靠的平台</li>\n<li>24/7 客户支援</li>\n<li>优惠多多，回馈不断</li>\n</ul>\n\n<h2>立即开始您的游戏之旅</h2>\n\n<p>注册即可获得丰厚的欢迎奖金。开始您的线上博弈冒险吧！</p>'
  },
  {
    name: 'Games',
    content: '<h1>我们的游戏</h1>\n\n<p>探索我们丰富多样的游戏世界：</p>\n\n<h2>老虎机</h2>\n<p>从经典三轮到最新的视频老虎机，应有尽有。</p>\n\n<h2>扑克</h2>\n<p>德州扑克、奥马哈等多种玩法，适合各种级别的玩家。</p>\n\n<h2>轮盘</h2>\n<p>欧洲轮盘、美式轮盘，体验不同的刺激。</p>\n\n<h2>百家乐</h2>\n<p>简单易懂，深受玩家喜爱的经典游戏。</p>'
  },
  {
    name: 'Promotions',
    content: '<h1>优惠活动</h1>\n\n<p>在我们的平台，精彩优惠不断！</p>\n\n<h2>新玩家欢迎奖金</h2>\n<p>首存最高可获 100% 奖金，最高可达 $1000。</p>\n\n<h2>每周返水</h2>\n<p>每周享受高达 1% 的返水优惠。</p>\n\n<h2>VIP 计划</h2>\n<p>成为 VIP 会员，享受专属优惠和个人管家服务。</p>\n\n<h2>节日特别活动</h2>\n<p>在重要节日期间，我们会推出特别的优惠活动。敬请关注！</p>'
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
          <button class="edit-btn">编辑</button>
          ${index !== 0 ? `<button class="remove-btn">删除</button>` : ''}
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
                  <h1>${document.getElementById('siteName').value || '我的线上博弈网站'}</h1>
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
                  <p>&copy; 2024 ${document.getElementById('siteName').value || '我的线上博弈网站'}. All rights reserved.</p>
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
      content: `<h1>${newPageName}</h1>\n\n<p>这是 ${newPageName} 页面的内容。</p>`
    });
    updatePageList();
    document.getElementById('newPageName').value = '';
    updatePreview();
  } else {
    alert('请输入有效的页面名称且不要重复');
  }
}

function removePage(index) {
  if (confirm('确定要删除这个页面吗？')) {
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
    alert('请输入有效的页面名称且不要重复');
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
      document.getElementById('message').textContent = '请选择一个文件。';
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
          document.getElementById('message').textContent = '文件上传成功。';
          if (data.pages) {
              pages = data.pages;
              updatePageList();
              updatePreview();
          }
      } else {
          document.getElementById('message').textContent = '文件上传失败：' + (data.message || '未知错误');
      }
  })
  .catch(error => {
      console.error('Upload error:', error);
      document.getElementById('message').textContent = '上传过程中发生错误：' + error.message;
  });
}

function analyzeCompetitor() {
  const url = document.getElementById('competitorUrl').value.trim();
  if (!url) {
      document.getElementById('analysisMessage').textContent = '请输入有效的竞品网址';
      return;
  }

  document.getElementById('analysisMessage').textContent = '开始分析...';
  document.getElementById('analysisProgress').style.display = 'block';

  fetch('/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ url })
  })
  .then(response => {
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
  })
  .then(data => {
      if (data.success && data.pages) {
          displayResult(data.pages);
      } else {
          throw new Error(data.message || '分析失败');
      }
  })
  .catch(error => {
      console.error('分析错误:', error);
      document.getElementById('analysisMessage').textContent = '发生错误: ' + (error.message || '未知错误');
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
    console.error("生成网站时出错:", error);
    alert("生成网站时出错，请查看控制台以获取更多信息。");
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

  // 添加新的事件监听器
  const desktopPreviewBtn = document.querySelector('button[onclick="switchPreviewMode(\'desktop\')"]');
  const mobilePreviewBtn = document.querySelector('button[onclick="switchPreviewMode(\'mobile\')"]');

  if (desktopPreviewBtn) {
      desktopPreviewBtn.addEventListener('click', () => switchPreviewMode('desktop'));
  }
  if (mobilePreviewBtn) {
      mobilePreviewBtn.addEventListener('click', () => switchPreviewMode('mobile'));
  }

  updatePreview(); // 初始化预览
});
