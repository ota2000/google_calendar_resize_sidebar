// Google Calendar's internal sidebar class name.
// This may change when Google updates their UI. See: https://github.com/ota2000/google_calendar_resize_sidebar/issues/2
const SIDEBAR_CLASS = 'QQYuzf';
const DEFAULT_WIDTH = 256;

const safeGetItem = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeSetItem = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Ignore storage errors (e.g. private browsing mode)
  }
};

// Observe theme changes and apply data-theme attribute
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

  observeTheme();

  // Restore saved width
  const savedWidth = safeGetItem('gcal-sidebar-width');
  if (savedWidth) {
    sidebar.style.width = `${savedWidth}px`;
  }

  let isResizing = false;
  let startX;
  let startWidth;
  let rafId = null;

  // Start resizing on mousedown at the right edge
  sidebar.addEventListener('mousedown', (e) => {
    if (e.offsetX <= sidebar.offsetWidth - 20) return;

    isResizing = true;
    startX = e.pageX;
    startWidth = sidebar.offsetWidth;
    sidebar.classList.add('resizing');

    e.preventDefault();
  });

  // Resize with requestAnimationFrame throttling
  document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;

    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      const width = startWidth + (e.pageX - startX);
      if (width >= 200 && width <= 600) {
        sidebar.style.width = `${width}px`;
        safeSetItem('gcal-sidebar-width', width);
      }
      rafId = null;
    });
  });

  // Stop resizing
  document.addEventListener('mouseup', () => {
    if (isResizing) {
      sidebar.classList.remove('resizing');
      isResizing = false;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }
  });

  // Double-click to reset width
  sidebar.addEventListener('dblclick', (e) => {
    if (e.offsetX <= sidebar.offsetWidth - 20) return;

    sidebar.style.width = `${DEFAULT_WIDTH}px`;
    safeSetItem('gcal-sidebar-width', DEFAULT_WIDTH);
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeSidebar);
} else {
  initializeSidebar();
}
