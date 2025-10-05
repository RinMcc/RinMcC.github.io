// Theme persistence and toggle
(function(){
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  const saved = localStorage.getItem('theme');

  if(saved){
    root.setAttribute('data-theme', saved);
  } else {
    // Default to dark theme for terminal aesthetic
    root.setAttribute('data-theme', 'dark');
  }

  if(toggle){
    toggle.addEventListener('click', ()=>{
      const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }
})();

// System time display
(function(){
  function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const taskbarTime = document.getElementById('taskbarTime');
    const systemTime = document.getElementById('systemTime');

    if(taskbarTime) taskbarTime.textContent = `${hours}:${minutes}`;
    if(systemTime) systemTime.textContent = `${hours}:${minutes}:${seconds}`;
  }

  updateTime();
  setInterval(updateTime, 1000);
})();

// Window management
(function(){
  const windows = document.querySelectorAll('.window');
  const desktopIcons = document.querySelectorAll('.desktop-icon');
  const taskbarTasks = document.querySelector('.taskbar-tasks');

  let activeWindow = null;
  let highestZIndex = 100;

  // Open window function
  function openWindow(windowId) {
    const targetWindow = document.getElementById(windowId + 'Window');
    if(!targetWindow) return;

    // If window is already open, restore from minimized or bring to front
    if(targetWindow.classList.contains('open')) {
      targetWindow.classList.remove('minimized');
      targetWindow.style.zIndex = ++highestZIndex;
      // Remove active class from all windows
      windows.forEach(w => w.classList.remove('active'));
      // Set this as active
      targetWindow.classList.add('active');
      activeWindow = targetWindow;
      updateTaskbar();
      return;
    }

    // Show window and mark as open
    targetWindow.classList.add('open', 'active');
    targetWindow.classList.remove('minimized');
    targetWindow.style.zIndex = ++highestZIndex;

    // Update active window (don't close the previous one)
    if(activeWindow && activeWindow !== targetWindow) {
      activeWindow.classList.remove('active');
    }
    activeWindow = targetWindow;

    // Update taskbar
    updateTaskbar();
  }

  // Minimize window function
  function minimizeWindow(window) {
    window.classList.remove('active');
    window.classList.add('minimized');
    if(activeWindow === window) {
      activeWindow = null;
    }
    updateTaskbar();
  }

  // Close window function
  function closeWindow(window) {
    window.classList.remove('open', 'active', 'minimized');
    if(activeWindow === window) {
      activeWindow = null;
    }
    updateTaskbar();
  }

  // Update taskbar tasks
  function updateTaskbar() {
    const openWindows = Array.from(windows).filter(w => w.classList.contains('open'));

    taskbarTasks.innerHTML = '';

    openWindows.forEach(window => {
      const windowName = window.getAttribute('data-window');
      const windowTitle = window.querySelector('.window-title span:last-child');
      const windowIcon = window.querySelector('.window-icon');

      const task = document.createElement('div');
      task.className = 'task';
      if(window === activeWindow && !window.classList.contains('minimized')) {
        task.classList.add('active');
      }
      if(window.classList.contains('minimized')) {
        task.classList.add('minimized');
      }
      task.setAttribute('data-window', windowName);

      const icon = document.createElement('span');
      icon.className = 'task-icon';

      // Check if window icon has an image or is text
      const iconImg = windowIcon ? windowIcon.querySelector('img') : null;
      if(iconImg) {
        const clonedImg = iconImg.cloneNode(true);
        icon.appendChild(clonedImg);
      } else {
        icon.textContent = windowIcon ? windowIcon.textContent : '📄';
      }

      const label = document.createElement('span');
      label.className = 'task-label';
      label.textContent = windowTitle ? windowTitle.textContent : windowName;

      task.appendChild(icon);
      task.appendChild(label);

      task.addEventListener('click', () => {
        if(window === activeWindow && !window.classList.contains('minimized')) {
          // Minimize if already active
          minimizeWindow(window);
        } else {
          // Restore from minimized or bring to front
          window.classList.remove('minimized');
          window.classList.add('active');
          window.style.zIndex = ++highestZIndex;
          if(activeWindow) activeWindow.classList.remove('active');
          activeWindow = window;
          updateTaskbar();
        }
      });

      taskbarTasks.appendChild(task);
    });
  }

  // Desktop icon click handlers
  desktopIcons.forEach(icon => {
    icon.addEventListener('click', () => {
      const windowName = icon.getAttribute('data-window');
      openWindow(windowName);

      // Update icon active state
      desktopIcons.forEach(i => i.classList.remove('active'));
      icon.classList.add('active');
    });

    // Double-click for mobile
    icon.addEventListener('dblclick', () => {
      const windowName = icon.getAttribute('data-window');
      openWindow(windowName);
    });
  });

  // Window control buttons
  windows.forEach(window => {
    const closeBtn = window.querySelector('.window-btn.close');
    const minimizeBtn = window.querySelector('.window-btn.minimize');

    if(closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeWindow(window);
      });
    }

    if(minimizeBtn) {
      minimizeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        minimizeWindow(window);
      });
    }
  });

  // Window dragging
  windows.forEach(window => {
    const header = window.querySelector('.window-header');
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    header.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    // Touch events for mobile
    header.addEventListener('touchstart', dragStart);
    document.addEventListener('touchmove', drag);
    document.addEventListener('touchend', dragEnd);

    function dragStart(e) {
      if(e.target.closest('.window-btn')) return;

      if(e.type === 'touchstart') {
        initialX = e.touches[0].clientX - xOffset;
        initialY = e.touches[0].clientY - yOffset;
      } else {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
      }

      if(e.target === header || header.contains(e.target)) {
        isDragging = true;

        // Bring to front
        window.style.zIndex = ++highestZIndex;
        if(activeWindow !== window) {
          if(activeWindow) activeWindow.classList.remove('active');
          window.classList.add('active');
          activeWindow = window;
          updateTaskbar();
        }
      }
    }

    function drag(e) {
      if(isDragging) {
        e.preventDefault();

        if(e.type === 'touchmove') {
          currentX = e.touches[0].clientX - initialX;
          currentY = e.touches[0].clientY - initialY;
        } else {
          currentX = e.clientX - initialX;
          currentY = e.clientY - initialY;
        }

        xOffset = currentX;
        yOffset = currentY;

        setTranslate(currentX, currentY, window);
      }
    }

    function dragEnd(e) {
      initialX = currentX;
      initialY = currentY;
      isDragging = false;
    }

    function setTranslate(xPos, yPos, el) {
      const currentTransform = el.style.transform;

      // Preserve any existing transforms (like translateX(-50%) on main window)
      if(el.id === 'mainWindow') {
        el.style.transform = `translateX(-50%) translate(${xPos}px, ${yPos}px)`;
      } else {
        el.style.transform = `translate(${xPos}px, ${yPos}px)`;
      }
    }
  });

  // Initialize main window as open
  const mainWindow = document.getElementById('mainWindow');
  if(mainWindow) {
    mainWindow.classList.add('open', 'active');
    activeWindow = mainWindow;
    updateTaskbar();
  }
})();

// Copy email functionality
(function(){
  const copyBtns = document.querySelectorAll('.copy-btn');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();

      const email = btn.getAttribute('data-copy') || 'aaronedmccarthy@gmail.com';

      try{
        await navigator.clipboard.writeText(email);

        const prev = btn.textContent;
        btn.textContent = 'copied!';
        btn.style.background = 'var(--accent-primary)';
        btn.style.color = 'var(--window-bg)';

        setTimeout(() => {
          btn.textContent = prev;
          btn.style.background = '';
          btn.style.color = '';
        }, 1500);
      } catch(_e) {
        // Fallback for browsers that don't support clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = email;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);

        const prev = btn.textContent;
        btn.textContent = 'copied!';
        setTimeout(() => { btn.textContent = prev; }, 1500);
      }
    });
  });
})();

// Start menu functionality
(function(){
  const startBtn = document.querySelector('.start-btn');
  const startMenu = document.getElementById('startMenu');

  if(startBtn && startMenu) {
    // Toggle start menu
    startBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      startMenu.classList.toggle('open');
    });

    // Close start menu when clicking outside
    document.addEventListener('click', (e) => {
      if(!startMenu.contains(e.target) && !startBtn.contains(e.target)) {
        startMenu.classList.remove('open');
      }
    });

    // Handle start menu item clicks
    const menuItems = startMenu.querySelectorAll('.start-menu-item[data-window]');
    menuItems.forEach(item => {
      item.addEventListener('click', () => {
        const windowName = item.getAttribute('data-window');

        // Find the desktop icon click handler and trigger it
        const desktopIcon = document.querySelector(`.desktop-icon[data-window="${windowName}"]`);
        if(desktopIcon) {
          desktopIcon.click();
        }

        // Close start menu
        startMenu.classList.remove('open');
      });
    });
  }
})();

// Window focus management - click to focus
(function(){
  const windows = document.querySelectorAll('.window');

  windows.forEach(window => {
    window.addEventListener('mousedown', () => {
      // Only focus if window is open
      if(window.classList.contains('open')) {
        // Find current highest z-index
        let maxZ = 100;
        windows.forEach(w => {
          const z = parseInt(w.style.zIndex) || 0;
          if(z > maxZ) maxZ = z;
        });

        windows.forEach(w => w.classList.remove('active'));
        window.classList.add('active');
        window.style.zIndex = maxZ + 1;
      }
    });
  });
})();

// Keyboard shortcuts
(function(){
  document.addEventListener('keydown', (e) => {
    // Alt + T for theme toggle
    if(e.altKey && e.key === 't') {
      e.preventDefault();
      const toggle = document.getElementById('themeToggle');
      if(toggle) toggle.click();
    }

    // Escape to close active window
    if(e.key === 'Escape') {
      const activeWindow = document.querySelector('.window.active');
      if(activeWindow) {
        const closeBtn = activeWindow.querySelector('.window-btn.close');
        if(closeBtn) closeBtn.click();
      }
    }
  });
})();
