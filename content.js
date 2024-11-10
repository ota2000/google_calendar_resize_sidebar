const SIDEBAR_CLASS = 'QQYuzf';
const DEFAULT_WIDTH = 256;

const initializeSidebar = () => {
  const sidebar = document.querySelector(`.${SIDEBAR_CLASS}`);
  if (!sidebar) {
    setTimeout(initializeSidebar, 500);
    return;
  }

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
