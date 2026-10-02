class WindowManager {
  constructor() {
    this.windows = [];
    this.zIndexCounter = 100;
  }

  createWindow(appId, title, content, options = {}) {
    const win = document.createElement('div');
    win.className = 'window';
    win.dataset.appid = appId;
    
    const defaults = { width: 600, height: 400, x: 100, y: 100, resizable: true };
    const opts = { ...defaults, ...options };
    
    win.style.width = `${opts.width}px`;
    win.style.height = `${opts.height}px`;
    win.style.left = `${opts.x}px`;
    win.style.top = `${opts.y}px`;
    win.style.zIndex = ++this.zIndexCounter;

    win.innerHTML = `
      <div class="window-header">
        <div class="traffic-lights">
          <div class="light red"></div>
          <div class="light yellow"></div>
          <div class="light green"></div>
        </div>
        <div class="title">${title}</div>
      </div>
      <div class="window-content">${content}</div>
    `;

    document.getElementById('desktop').appendChild(win);
    this.windows.push(win);

    this.setupInteractions(win, opts.resizable);
    this.focusWindow(win);
    return win;
  }

  setupInteractions(win, resizable) {
    const header = win.querySelector('.window-header');
    
    win.addEventListener('mousedown', () => this.focusWindow(win));

    let isDragging = false;
    let startX, startY, startLeft, startTop;

    header.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('light')) return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startLeft = parseInt(win.style.left) || 0;
      startTop = parseInt(win.style.top) || 0;
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      let newLeft = startLeft + (e.clientX - startX);
      let newTop = startTop + (e.clientY - startY);
      
      // Bounds checking
      newTop = Math.max(25, newTop); // Keep below menu bar
      
      win.style.left = `${newLeft}px`;
      win.style.top = `${newTop}px`;
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Traffic lights
    win.querySelector('.red').addEventListener('click', () => this.closeWindow(win));
    win.querySelector('.yellow').addEventListener('click', () => this.minimizeWindow(win));
    win.querySelector('.green').addEventListener('click', () => this.maximizeWindow(win));
  }

  closeWindow(win) {
    win.style.opacity = '0';
    win.style.transform = 'scale(0.9)';
    setTimeout(() => {
      win.remove();
      this.windows = this.windows.filter(w => w !== win);
    }, 200);
  }

  minimizeWindow(win) {
    win.style.display = 'none'; // Simple minimize for now
  }

  maximizeWindow(win) {
    if (win.dataset.maximized) {
      win.style.width = win.dataset.oldWidth;
      win.style.height = win.dataset.oldHeight;
      win.style.left = win.dataset.oldLeft;
      win.style.top = win.dataset.oldTop;
      delete win.dataset.maximized;
    } else {
      win.dataset.oldWidth = win.style.width;
      win.dataset.oldHeight = win.style.height;
      win.dataset.oldLeft = win.style.left;
      win.dataset.oldTop = win.style.top;
      
      win.style.width = '100%';
      win.style.height = 'calc(100% - 25px)';
      win.style.left = '0';
      win.style.top = '25px';
      win.dataset.maximized = 'true';
    }
  }

  focusWindow(win) {
    win.style.zIndex = ++this.zIndexCounter;
    this.windows.forEach(w => w.classList.remove('active'));
    win.classList.add('active');
    
    if (window.osEvents) {
      window.osEvents.emit('app-focused', win.dataset.appid);
    }
  }

  getActiveWindow() {
    return this.windows.sort((a, b) => parseInt(b.style.zIndex) - parseInt(a.style.zIndex))[0];
  }
}

const windowManager = new WindowManager();
export default windowManager;
