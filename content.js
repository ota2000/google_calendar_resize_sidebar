const SIDEBAR_CLASS = 'QQYuzf';
const DEFAULT_WIDTH = 256;

// テーマの監視と適用
const observeTheme = () => {
  const themeObserver = new MutationObserver(() => {
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    const isDarkMode = metaTheme?.getAttribute('content') === '#1B1B1B';
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  });

  themeObserver.observe(document.head, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['content']
  });
};

const initializeSidebar = () => {
  const sidebar = document.querySelector(`.${SIDEBAR_CLASS}`);
  if (!sidebar) {
    setTimeout(initializeSidebar, 500);
    return;
  }

  observeTheme();  // テーマ監視を開始

  // 保存された幅を復元
  const savedWidth = localStorage.getItem('gcal-sidebar-width');
  if (savedWidth) {
    sidebar.style.width = `${savedWidth}px`;
  }

  let isResizing = false;
  let startX;
  let startWidth;

  // マウスダウンでリサイズ開始
  sidebar.addEventListener('mousedown', (e) => {
    if (e.offsetX <= sidebar.offsetWidth - 20) return;

    isResizing = true;
    startX = e.pageX;
    startWidth = sidebar.offsetWidth;
    sidebar.classList.add('resizing');

    e.preventDefault();
  });

  // リサイズ中
  document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;

    const width = startWidth + (e.pageX - startX);
    if (width >= 200 && width <= 600) {
      sidebar.style.width = `${width}px`;
      localStorage.setItem('gcal-sidebar-width', width);
    }
  });

  // リサイズ終了
  document.addEventListener('mouseup', () => {
    if (isResizing) {
      sidebar.classList.remove('resizing');
      isResizing = false;
    }
  });

  // ダブルクリックでリセット
  sidebar.addEventListener('dblclick', (e) => {
    if (e.offsetX <= sidebar.offsetWidth - 20) return;

    sidebar.style.width = `${DEFAULT_WIDTH}px`;
    localStorage.setItem('gcal-sidebar-width', DEFAULT_WIDTH);
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeSidebar);
} else {
  initializeSidebar();
}
