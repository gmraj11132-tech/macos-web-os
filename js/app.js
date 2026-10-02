// ============================================================
// app.js - macOS Web OS Main Orchestrator
// ============================================================

// ---------- Global State ----------
window.macOS = {
  version: 'macOS Web Sequoia 15.0',
  buildNumber: '24A335',
  user: {
    name: 'Aryan Raj',
    fullName: 'Aryan Raj',
    role: 'Software Engineer & AI Developer',
    institution: 'Techno India University',
    cgpa: '8.0',
    avatar: 'assets/profile.jpg',
    github: 'https://github.com/gmraj11132-tech',
    linkedin: 'https://www.linkedin.com/in/aryanrajcse',
    email: 'aryanjaiswal11132@gmail.com',
    phone: '+91 8340177620',
    location: 'Noida, Alpha 2, India'
  },
  apps: {},
  windowManager: null,
  fileSystem: null,
  settings: {
    appearance: 'light',
    accentColor: '#007AFF',
    dockSize: 48,
    dockMagnification: true,
    dockPosition: 'bottom',
    dockAutoHide: false,
    wallpaper: 'default'
  }
};

// ---------- Event Bus ----------
window.osEvents = {
  listeners: {},
  on(event, cb) { (this.listeners[event] = this.listeners[event] || []).push(cb); },
  off(event, cb) { if (this.listeners[event]) this.listeners[event] = this.listeners[event].filter(f => f !== cb); },
  emit(event, ...args) { (this.listeners[event] || []).forEach(cb => cb(...args)); }
};

// ---------- App Registry ----------
const appRegistry = {
  finder:     { name: 'Finder',           icon: 'fa-folder',    color: '#147EFB', alwaysRunning: true },
  about:      { name: 'About This Mac',   icon: 'fa-apple',     color: '#0284c7' },
  github:     { name: 'GitHub',           icon: 'fa-github',    color: '#24292f' },
  linkedin:   { name: 'LinkedIn',         icon: 'fa-linkedin-in', color: '#0a66c2' },
  safari:     { name: 'Safari',           icon: 'fa-compass',   color: '#006CFF' },
  terminal:   { name: 'Terminal',         icon: 'fa-terminal',  color: '#000000' },
  calculator: { name: 'Calculator',       icon: 'fa-calculator', color: '#8E8E93' },
  notes:      { name: 'Notes',            icon: 'fa-note-sticky', color: '#FFD60A' },
  textedit:   { name: 'TextEdit',         icon: 'fa-file-lines', color: '#3478F6' },
  settings:   { name: 'System Settings',  icon: 'fa-gear',      color: '#8E8E93' },
  calendar:   { name: 'Calendar',         icon: 'fa-calendar',  color: '#FF3B30' },
  photos:     { name: 'Photos',           icon: 'fa-images',    color: '#FF2D55' },
  music:      { name: 'Music',            icon: 'fa-music',     color: '#FC3C44' },
  appstore:   { name: 'App Store',        icon: 'fa-store',     color: '#007AFF' },
  maps:       { name: 'Maps',             icon: 'fa-map',       color: '#34C759' },
  messages:   { name: 'Messages',         icon: 'fa-message',   color: '#34C759' },
  mail:       { name: 'Mail',             icon: 'fa-envelope',  color: '#007AFF' },
  weather:    { name: 'Weather',          icon: 'fa-cloud-sun', color: '#4A90D9' },
  launchpad:  { name: 'Launchpad',        icon: 'fa-rocket',    color: '#8E8E93' }
};
window.macOS.appRegistry = appRegistry;
window.runningApps = new Set(['finder']);

// ============================================================
// BOOT SEQUENCE
// ============================================================
function startBoot() {
  const bootScreen   = document.getElementById('boot-screen');
  const loginScreen  = document.getElementById('login-screen');
  const desktopScreen = document.getElementById('desktop-screen');
  const lockScreen   = document.getElementById('lock-screen');

  // Hide everything except boot
  [loginScreen, desktopScreen, lockScreen].forEach(s => { if (s) s.classList.add('hidden'); });
  if (bootScreen) bootScreen.classList.remove('hidden');

  // Animate progress bar
  const bar = document.getElementById('boot-progress-bar');
  if (bar) {
    bar.style.width = '0%';
    requestAnimationFrame(() => {
      bar.style.transition = 'width 3s cubic-bezier(0.4, 0, 0.2, 1)';
      bar.style.width = '100%';
    });
  }

  // After 3.2s, fade out boot → show login
  setTimeout(() => {
    if (bootScreen) {
      bootScreen.style.transition = 'opacity 0.6s ease';
      bootScreen.style.opacity = '0';
      setTimeout(() => {
        bootScreen.classList.add('hidden');
        bootScreen.style.opacity = '1';
        showLogin();
      }, 600);
    }
  }, 3200);
}

// ============================================================
// LOGIN SCREEN
// ============================================================
function showLogin() {
  const loginScreen = document.getElementById('login-screen');
  if (!loginScreen) return;
  loginScreen.classList.remove('hidden');
  loginScreen.style.opacity = '0';
  requestAnimationFrame(() => {
    loginScreen.style.transition = 'opacity 0.5s ease';
    loginScreen.style.opacity = '1';
  });

  const pwInput = document.getElementById('login-password');
  const loginBtn = document.getElementById('login-btn');
  if (pwInput) pwInput.focus();

  const doLogin = () => {
    loginScreen.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    loginScreen.style.opacity = '0';
    loginScreen.style.transform = 'scale(1.04)';
    setTimeout(() => {
      loginScreen.classList.add('hidden');
      loginScreen.style.transform = '';
      initDesktop();
    }, 500);
  };

  if (pwInput) pwInput.addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
  if (loginBtn) loginBtn.addEventListener('click', doLogin);
}

// ============================================================
// DESKTOP INITIALIZATION
// ============================================================
function initDesktop() {
  const desktopScreen = document.getElementById('desktop-screen');
  if (!desktopScreen) return;
  desktopScreen.classList.remove('hidden');
  desktopScreen.style.opacity = '0';
  requestAnimationFrame(() => {
    desktopScreen.style.transition = 'opacity 0.5s ease';
    desktopScreen.style.opacity = '1';
  });

  loadSettings();
  initWindowManager();
  initFileSystem();
  initMenuBar();
  initDock();
  initSpotlight();
  initControlCenter();
  initLaunchpad();
  initContextMenu();
  initNotifications();
  initLockScreen();
  setupKeyboardShortcuts();
  setupAutoSave();

  // Register all apps
  Object.keys(appRegistry).forEach(id => {
    if (window.macOS.apps[id] && window.macOS.apps[id].init) {
      window.macOS.apps[id].init();
    }
  });
}

// ============================================================
// WINDOW MANAGER
// ============================================================
function initWindowManager() {
  let zIndex = 100;
  const windows = [];

  const wm = {
    createWindow(appId, title, content, opts = {}) {
      const defaults = { width: 700, height: 460, x: 80 + Math.random() * 100, y: 60 + Math.random() * 60, resizable: true };
      const o = { ...defaults, ...opts };

      // Handle alternate calling conventions from apps
      if (typeof appId === 'object') {
        const cfg = appId;
        title = cfg.title || 'Window';
        content = cfg.content || '';
        o.width = cfg.width || defaults.width;
        o.height = cfg.height || defaults.height;
        appId = cfg.id || cfg.appId || 'unknown';
      }

      const win = document.createElement('div');
      win.className = 'window active';
      win.dataset.app = appId;
      win.style.cssText = `width:${o.width}px; height:${o.height}px; left:${o.x}px; top:${o.y}px; z-index:${++zIndex}; position:absolute; opacity:0; transform:scale(0.92);`;

      win.innerHTML = `
        <div class="window-titlebar">
          <div class="traffic-lights">
            <div class="traffic-light close"></div>
            <div class="traffic-light minimize"></div>
            <div class="traffic-light maximize"></div>
          </div>
          <div class="window-title">${title}</div>
        </div>
        <div class="window-body">${content}</div>
      `;

      const container = document.getElementById('window-container');
      if (container) container.appendChild(win);
      windows.push(win);

      // Animate in
      requestAnimationFrame(() => {
        win.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        win.style.opacity = '1';
        win.style.transform = 'scale(1)';
      });

      // Drag
      setupDrag(win);
      // Traffic lights
      win.querySelector('.close').addEventListener('click', () => wm.closeWindow(win));
      win.querySelector('.minimize').addEventListener('click', () => wm.minimizeWindow(win));
      win.querySelector('.maximize').addEventListener('click', () => wm.maximizeWindow(win));
      // Focus on click
      win.addEventListener('mousedown', () => wm.focusWindow(win));

      // Update menubar
      const reg = appRegistry[appId];
      if (reg) {
        const appNameEl = document.querySelector('.app-name b') || document.querySelector('.app-name');
        if (appNameEl) appNameEl.textContent = reg.name;
      }

      return win;
    },

    closeWindow(win) {
      win.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
      win.style.opacity = '0';
      win.style.transform = 'scale(0.92)';
      setTimeout(() => {
        win.remove();
        const idx = windows.indexOf(win);
        if (idx > -1) windows.splice(idx, 1);
        window.osEvents.emit('window-closed', win.dataset.app);
      }, 200);
    },

    minimizeWindow(win) {
      win.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      win.style.opacity = '0';
      win.style.transform = 'scale(0.4) translateY(300px)';
      setTimeout(() => { win.style.display = 'none'; }, 300);
    },

    maximizeWindow(win) {
      if (win.dataset.maximized === 'true') {
        win.style.width = win.dataset.ow;
        win.style.height = win.dataset.oh;
        win.style.left = win.dataset.ol;
        win.style.top = win.dataset.ot;
        delete win.dataset.maximized;
      } else {
        win.dataset.ow = win.style.width;
        win.dataset.oh = win.style.height;
        win.dataset.ol = win.style.left;
        win.dataset.ot = win.style.top;
        win.style.transition = 'all 0.3s ease';
        win.style.width = '100vw';
        win.style.height = 'calc(100vh - 25px - 70px)';
        win.style.left = '0';
        win.style.top = '25px';
        win.dataset.maximized = 'true';
      }
    },

    focusWindow(win) {
      windows.forEach(w => w.classList.remove('active'));
      win.classList.add('active');
      win.style.zIndex = ++zIndex;
      const reg = appRegistry[win.dataset.app];
      if (reg) {
        const appNameEl = document.querySelector('.app-name b') || document.querySelector('.app-name');
        if (appNameEl) appNameEl.textContent = reg.name;
      }
    },

    getActiveWindow() {
      return windows.filter(w => w.style.display !== 'none').sort((a, b) => parseInt(b.style.zIndex) - parseInt(a.style.zIndex))[0];
    },

    closeAll(appId) {
      [...windows].filter(w => w.dataset.app === appId).forEach(w => wm.closeWindow(w));
    }
  };

  function setupDrag(win) {
    const titlebar = win.querySelector('.window-titlebar');
    let dragging = false, sx, sy, sl, st;
    titlebar.addEventListener('mousedown', e => {
      if (e.target.classList.contains('traffic-light')) return;
      dragging = true;
      sx = e.clientX; sy = e.clientY;
      sl = parseInt(win.style.left) || 0;
      st = parseInt(win.style.top) || 0;
      win.style.transition = 'none';
    });
    document.addEventListener('mousemove', e => {
      if (!dragging) return;
      win.style.left = Math.max(0, sl + e.clientX - sx) + 'px';
      win.style.top = Math.max(25, st + e.clientY - sy) + 'px';
    });
    document.addEventListener('mouseup', () => { dragging = false; });
    // Double-click to maximize
    titlebar.addEventListener('dblclick', () => wm.maximizeWindow(win));
  }

  window.macOS.windowManager = wm;
  window.osEvents.on('close-active-window', () => { const w = wm.getActiveWindow(); if (w) wm.closeWindow(w); });
  window.osEvents.on('minimize-active-window', () => { const w = wm.getActiveWindow(); if (w) wm.minimizeWindow(w); });
}

// ============================================================
// VIRTUAL FILE SYSTEM
// ============================================================
function initFileSystem() {
  const defaultFS = {
    '/': { type: 'folder', children: ['Users', 'Applications', 'System'] },
    '/Users': { type: 'folder', children: ['admin'] },
    '/Users/admin': { type: 'folder', children: ['Desktop', 'Documents', 'Downloads', 'Pictures', 'Music', 'Movies'] },
    '/Users/admin/Desktop': { type: 'folder', children: ['readme.txt', 'Projects'] },
    '/Users/admin/Desktop/readme.txt': { type: 'file', content: 'Welcome to macOS Web!', size: 21 },
    '/Users/admin/Desktop/Projects': { type: 'folder', children: [] },
    '/Users/admin/Documents': { type: 'folder', children: ['notes.md', 'report.pdf'] },
    '/Users/admin/Documents/notes.md': { type: 'file', content: '# My Notes\n\nHello World!', size: 25 },
    '/Users/admin/Documents/report.pdf': { type: 'file', content: '[PDF Content]', size: 1024 },
    '/Users/admin/Downloads': { type: 'folder', children: ['image.jpg'] },
    '/Users/admin/Downloads/image.jpg': { type: 'file', content: '', size: 2048 },
    '/Users/admin/Pictures': { type: 'folder', children: ['wallpaper.jpg', 'photo1.png'] },
    '/Users/admin/Music': { type: 'folder', children: [] },
    '/Users/admin/Movies': { type: 'folder', children: [] },
    '/Applications': { type: 'folder', children: Object.values(appRegistry).map(a => a.name + '.app') },
    '/System': { type: 'folder', children: ['Library'] },
    '/System/Library': { type: 'folder', children: [] }
  };

  let fs = JSON.parse(localStorage.getItem('macOS_fs') || 'null') || defaultFS;

  window.macOS.fileSystem = {
    list(path) {
      const node = fs[path];
      return node && node.type === 'folder' ? node.children : [];
    },
    get(path) { return fs[path] || null; },
    createFile(path, name, content = '') {
      const parent = fs[path];
      if (parent && parent.type === 'folder') {
        parent.children.push(name);
        fs[path + '/' + name] = { type: 'file', content, size: content.length };
        this.save();
      }
    },
    createFolder(path, name) {
      const parent = fs[path];
      if (parent && parent.type === 'folder') {
        parent.children.push(name);
        fs[path + '/' + name] = { type: 'folder', children: [] };
        this.save();
      }
    },
    delete(path) {
      const parts = path.split('/');
      const name = parts.pop();
      const parentPath = parts.join('/') || '/';
      const parent = fs[parentPath];
      if (parent) {
        parent.children = parent.children.filter(c => c !== name);
        delete fs[path];
        this.save();
      }
    },
    save() { localStorage.setItem('macOS_fs', JSON.stringify(fs)); },
    getAll() { return fs; }
  };
}

// ============================================================
// MENU BAR
// ============================================================
function initMenuBar() {
  // Clock
  const clockEl = document.getElementById('datetime-display');
  const updateClock = () => {
    const now = new Date();
    const str = now.toLocaleDateString('en-US', { weekday: 'short' }) + ' ' +
                now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + '  ' +
                now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    if (clockEl) clockEl.textContent = str;
  };
  setInterval(updateClock, 1000);
  updateClock();

  // Apple menu toggle
  const appleBtn = document.querySelector('.apple-menu-btn');
  const appleMenu = document.getElementById('apple-menu');
  if (appleBtn && appleMenu) {
    appleBtn.addEventListener('click', e => {
      e.stopPropagation();
      appleMenu.classList.toggle('hidden');
    });
  }

  // Apple menu items
  document.getElementById('about-mac-btn')?.addEventListener('click', () => {
    appleMenu.classList.add('hidden');
    openApp('about');
  });
  document.getElementById('lock-screen-btn')?.addEventListener('click', () => {
    appleMenu.classList.add('hidden');
    showLockScreen();
  });
  document.getElementById('logout-btn')?.addEventListener('click', () => {
    appleMenu.classList.add('hidden');
    location.reload();
  });

  // Close menus on outside click
  document.addEventListener('click', () => {
    if (appleMenu) appleMenu.classList.add('hidden');
  });

  // Spotlight button
  document.getElementById('spotlight-btn')?.addEventListener('click', e => {
    e.stopPropagation();
    window.osEvents.emit('toggle-spotlight');
  });

  // Control Center button
  document.getElementById('control-center-btn')?.addEventListener('click', e => {
    e.stopPropagation();
    window.osEvents.emit('toggle-control-center');
  });
}

// ============================================================
// DOCK
// ============================================================
function initDock() {
  const dock = document.getElementById('dock');
  if (!dock) return;

  const items = dock.querySelectorAll('.dock-item');

  // Magnification effect
  dock.addEventListener('mousemove', e => {
    items.forEach(item => {
      const rect = item.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const dist = Math.abs(e.clientX - cx);
      const scale = 1 + Math.max(0, 1 - dist / 120) * 0.45;
      item.style.transform = `scale(${scale})`;
      item.style.transformOrigin = 'bottom center';
    });
  });
  dock.addEventListener('mouseleave', () => {
    items.forEach(item => { item.style.transform = 'scale(1)'; });
  });

  // Click to launch
  items.forEach(item => {
    const appId = item.dataset.app;

    // Tooltip
    item.addEventListener('mouseenter', () => {
      let tip = item.querySelector('.dock-tooltip');
      if (!tip) {
        tip = document.createElement('div');
        tip.className = 'dock-tooltip';
        tip.textContent = item.title || appId;
        tip.style.cssText = 'position:absolute; top:-32px; left:50%; transform:translateX(-50%); background:rgba(0,0,0,0.75); color:#fff; padding:3px 10px; border-radius:4px; font-size:12px; white-space:nowrap; pointer-events:none;';
        item.style.position = 'relative';
        item.appendChild(tip);
      }
    });
    item.addEventListener('mouseleave', () => {
      const tip = item.querySelector('.dock-tooltip');
      if (tip) tip.remove();
    });

    item.addEventListener('click', () => {
      if (!appId || appId === 'trash') return;
      if (appId === 'launchpad') { window.osEvents.emit('toggle-launchpad'); return; }

      // Bounce animation
      item.style.animation = 'dockBounce 0.5s ease';
      setTimeout(() => { item.style.animation = ''; }, 600);

      openApp(appId);
    });
  });
}

// ============================================================
// APP LAUNCHER
// ============================================================
function openApp(appId, extraArg) {
  const reg = appRegistry[appId];
  if (!reg) return;

  window.runningApps.add(appId);

  // Add running dot
  const dockItem = document.querySelector(`.dock-item[data-app="${appId}"]`);
  if (dockItem && !dockItem.querySelector('.dock-dot')) {
    const dot = document.createElement('div');
    dot.className = 'dock-dot active';
    dockItem.appendChild(dot);
  }

  // Update menubar
  const appNameEl = document.querySelector('.app-name b') || document.querySelector('.app-name');
  if (appNameEl) appNameEl.textContent = reg.name;

  // Check if app has custom open function
  if (window.macOS.apps[appId] && window.macOS.apps[appId].open) {
    window.macOS.apps[appId].open(extraArg);
    return;
  }

  let winWidth = 720, winHeight = 480;
  if (appId === 'about') { winWidth = 840; winHeight = 580; }
  else if (appId === 'github' || appId === 'linkedin') { winWidth = 880; winHeight = 580; }
  else if (appId === 'safari') { winWidth = 860; winHeight = 540; }
  else if (appId === 'calculator') { winWidth = 320; winHeight = 440; }

  // Default: use generic app window based on appId
  const appContent = generateAppContent(appId, extraArg);
  window.macOS.windowManager.createWindow(appId, reg.name, appContent, { width: winWidth, height: winHeight });
}
window.openApp = openApp;

// ============================================================
// APP CONTENT GENERATORS
// ============================================================
function generateAppContent(appId, extraArg) {
  switch (appId) {
    case 'about': return generateAboutContent(extraArg);
    case 'github': return generateGitHubContent();
    case 'linkedin': return generateLinkedInContent();
    case 'finder': return generateFinderContent();
    case 'safari': return generateSafariContent();
    case 'terminal': return generateTerminalContent();
    case 'calculator': return generateCalculatorContent();
    case 'notes': return generateNotesContent();
    case 'textedit': return generateTextEditContent();
    case 'settings': return generateSettingsContent();
    case 'calendar': return generateCalendarContent();
    case 'photos': return generatePhotosContent();
    case 'music': return generateMusicContent();
    case 'appstore': return generateAppStoreContent();
    case 'maps': return generateMapsContent();
    case 'messages': return generateMessagesContent();
    case 'mail': return generateMailContent();
    case 'weather': return generateWeatherContent();
    default: return `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#666;font-size:18px;">${appRegistry[appId]?.name || appId}</div>`;
  }
}

// --------- FINDER ---------
function generateFinderContent() {
  const files = window.macOS.fileSystem.list('/Users/admin/Desktop');
  const fileItems = files.map(f => {
    const node = window.macOS.fileSystem.get('/Users/admin/Desktop/' + f);
    const icon = node && node.type === 'folder' ? '📁' : '📄';
    return `<div class="finder-file" style="display:flex;flex-direction:column;align-items:center;cursor:pointer;padding:8px;border-radius:6px;" onmouseover="this.style.background='rgba(0,122,255,0.1)'" onmouseout="this.style.background=''">
      <div style="font-size:36px">${icon}</div><span style="font-size:11px;margin-top:4px;color:#333">${f}</span></div>`;
  }).join('');
  return `<div style="display:flex;height:100%;font-size:13px;color:#333">
    <div style="width:180px;background:rgba(240,240,240,0.95);border-right:1px solid #ddd;padding:8px;overflow-y:auto">
      <div style="font-size:11px;font-weight:600;color:#888;padding:4px 6px">Favorites</div>
      <div class="finder-sidebar-item" style="padding:5px 8px;border-radius:5px;cursor:pointer;display:flex;align-items:center;gap:6px" onmouseover="this.style.background='#e0e0e0'" onmouseout="this.style.background=''"><i class="fa-solid fa-clock" style="color:#007AFF;width:16px"></i> Recents</div>
      <div class="finder-sidebar-item" style="padding:5px 8px;border-radius:5px;cursor:pointer;display:flex;align-items:center;gap:6px" onmouseover="this.style.background='#e0e0e0'" onmouseout="this.style.background=''"><i class="fa-solid fa-rocket" style="color:#007AFF;width:16px"></i> Applications</div>
      <div class="finder-sidebar-item" style="padding:5px 8px;border-radius:5px;cursor:pointer;display:flex;align-items:center;gap:6px;background:#cce3ff"><i class="fa-solid fa-display" style="color:#007AFF;width:16px"></i> Desktop</div>
      <div class="finder-sidebar-item" style="padding:5px 8px;border-radius:5px;cursor:pointer;display:flex;align-items:center;gap:6px" onmouseover="this.style.background='#e0e0e0'" onmouseout="this.style.background=''"><i class="fa-solid fa-file" style="color:#007AFF;width:16px"></i> Documents</div>
      <div class="finder-sidebar-item" style="padding:5px 8px;border-radius:5px;cursor:pointer;display:flex;align-items:center;gap:6px" onmouseover="this.style.background='#e0e0e0'" onmouseout="this.style.background=''"><i class="fa-solid fa-download" style="color:#007AFF;width:16px"></i> Downloads</div>
    </div>
    <div style="flex:1;display:flex;flex-direction:column;background:#fff">
      <div style="padding:8px 12px;border-bottom:1px solid #e0e0e0;display:flex;align-items:center;gap:8px">
        <button style="border:none;background:none;cursor:pointer;font-size:14px;color:#666">◀</button>
        <button style="border:none;background:none;cursor:pointer;font-size:14px;color:#666">▶</button>
        <span style="font-weight:600;flex:1">Desktop</span>
        <input type="text" placeholder="Search" style="padding:4px 10px;border-radius:14px;border:1px solid #ccc;outline:none;font-size:12px;width:140px">
      </div>
      <div style="flex:1;padding:16px;display:grid;grid-template-columns:repeat(auto-fill,minmax(85px,1fr));gap:8px;overflow-y:auto;align-content:start">${fileItems}</div>
      <div style="padding:4px 12px;border-top:1px solid #e0e0e0;font-size:11px;color:#888;background:#fafafa">MacBook › Desktop — ${files.length} items</div>
    </div>
  </div>`;
}

// --------- SAFARI ---------
function generateSafariContent() {
  return `<div style="display:flex;flex-direction:column;height:100%">
    <div style="padding:6px 10px;background:#f5f5f7;border-bottom:1px solid #ddd;display:flex;align-items:center;gap:6px">
      <button style="border:none;background:none;cursor:pointer;font-size:14px;color:#999">◀</button>
      <button style="border:none;background:none;cursor:pointer;font-size:14px;color:#999">▶</button>
      <div style="flex:1;display:flex;justify-content:center">
        <input id="safari-url" type="text" value="https://www.google.com" style="width:60%;padding:6px 14px;border-radius:18px;border:1px solid #ccc;background:#fff;outline:none;font-size:13px;text-align:center" onkeydown="if(event.key==='Enter'){const f=this.closest('.window-body').querySelector('iframe');if(f)f.src=this.value}">
      </div>
      <button style="border:none;background:none;cursor:pointer;font-size:14px;color:#999">↻</button>
    </div>
    <div style="padding:4px 10px;background:#fafafa;border-bottom:1px solid #eee;display:flex;gap:12px;font-size:12px;color:#007AFF">
      <span style="cursor:pointer" onclick="const f=this.closest('.window-body').querySelector('iframe');if(f)f.src='https://www.google.com'">Google</span>
      <span style="cursor:pointer" onclick="const f=this.closest('.window-body').querySelector('iframe');if(f)f.src='https://www.youtube.com'">YouTube</span>
      <span style="cursor:pointer" onclick="const f=this.closest('.window-body').querySelector('iframe');if(f)f.src='https://en.wikipedia.org'">Wikipedia</span>
      <span style="cursor:pointer" onclick="const f=this.closest('.window-body').querySelector('iframe');if(f)f.src='https://github.com'">GitHub</span>
    </div>
    <iframe src="https://www.google.com/webhp?igu=1" style="flex:1;border:none;width:100%" sandbox="allow-scripts allow-same-origin allow-forms allow-popups"></iframe>
  </div>`;
}

// --------- TERMINAL ---------
function generateTerminalContent() {
  const tid = 'term-' + Date.now();
  setTimeout(() => initTerminalLogic(tid), 100);
  return `<div id="${tid}" style="background:#181825;color:#cdd6f4;font-family:'JetBrains Mono','Menlo',monospace;font-size:13px;padding:12px;height:100%;overflow-y:auto;display:flex;flex-direction:column">
    <div class="term-output" style="flex:1;overflow-y:auto;white-space:pre-wrap"><span style="color:#a6e3a1">aryan@macbook-pro</span>:<span style="color:#89b4fa">~</span>% Welcome to AryanOS (macOS Sequoia Web Edition)\nType <span style="color:#f9e2af;font-weight:bold">'help'</span>, <span style="color:#f9e2af;font-weight:bold">'neofetch'</span>, or <span style="color:#f9e2af;font-weight:bold">'projects'</span> to explore the environment.\n\n</div>
    <div style="display:flex;align-items:center"><span style="color:#a6e3a1">aryan@macbook-pro</span>:<span style="color:#89b4fa">~</span>% <input class="term-input" type="text" style="background:none;border:none;outline:none;color:#cdd6f4;font-family:inherit;font-size:inherit;flex:1;caret-color:#f5e0dc;margin-left:8px;" autofocus></div>
  </div>`;
}

function initTerminalLogic(tid) {
  const el = document.getElementById(tid);
  if (!el) return;
  const output = el.querySelector('.term-output');
  const input = el.querySelector('.term-input');
  let cwd = '/Users/admin';
  const history = [];
  let histIdx = -1;

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const cmd = input.value.trim();
      input.value = '';
      if (cmd) history.unshift(cmd);
      histIdx = -1;
      output.innerHTML += `<span style="color:#a6e3a1">aryan@macbook-pro</span>:<span style="color:#89b4fa">${cwd === '/Users/admin' ? '~' : cwd}</span>% ${cmd}\n`;
      const result = executeCommand(cmd);
      if (result) output.innerHTML += result + '\n';
      output.scrollTop = output.scrollHeight;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (histIdx < history.length - 1) { histIdx++; input.value = history[histIdx]; }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx > 0) { histIdx--; input.value = history[histIdx]; } else { histIdx = -1; input.value = ''; }
    }
  });
  input.focus();

  function executeCommand(cmd) {
    const parts = cmd.split(/\s+/);
    const c = parts[0]?.toLowerCase();
    const args = parts.slice(1);
    switch (c) {
      case 'ls': {
        const items = window.macOS.fileSystem.list(cwd);
        return items ? items.map(i => {
          const n = window.macOS.fileSystem.get(cwd + '/' + i);
          return n && n.type === 'folder' ? `<span style="color:#89b4fa;font-weight:bold">${i}/</span>` : i;
        }).join('  ') : 'No such directory';
      }
      case 'cd': {
        const target = args[0] || '/Users/admin';
        if (target === '..') { const p = cwd.split('/'); p.pop(); cwd = p.join('/') || '/'; }
        else if (target === '~') { cwd = '/Users/admin'; }
        else if (target.startsWith('/')) { cwd = target; }
        else { cwd = cwd + '/' + target; }
        return '';
      }
      case 'pwd': return cwd;
      case 'whoami': return '<span style="color:#a6e3a1;font-weight:bold">Aryan Raj</span> (B.Tech CSE, 8.0 CGPA) — Software Engineer & AI Developer';
      case 'bio':
      case 'about': return `<span style="color:#89b4fa;font-weight:bold">Aryan Raj</span> — Creator of macOS Web OS
B.Tech Computer Science & Engineering (4th Year, 8.0 CGPA) @ Techno India University
Location: Noida, Alpha 2, India
Email: aryanjaiswal11132@gmail.com | Phone: +91 8340177620
Specialization: Full Stack Systems, Gemini AI Integration, and High-Performance Web UI.`;
      case 'projects': return `<span style="color:#f9e2af;font-weight:bold">=== Aryan Raj Featured Projects ===</span>
1. <span style="color:#89b4fa;font-weight:bold">CareerPilot AI</span> — Smart Placement & Resume ATS Analyzer (Next.js 16 + Gemini)
   Live: <a href="https://careerpilot-green-three.vercel.app" target="_blank" style="color:#a6e3a1">https://careerpilot-green-three.vercel.app</a>
2. <span style="color:#89b4fa;font-weight:bold">ScamShield AI</span> — Dual-Engine Cyber Threat & Fraud Signal Analysis
   Live: <a href="https://gmraj11132-tech.github.io/scamshield-ai/" target="_blank" style="color:#a6e3a1">https://gmraj11132-tech.github.io/scamshield-ai/</a>
3. <span style="color:#89b4fa;font-weight:bold">AryanOS Portfolio</span> — macOS Crystal Glassmorphism Developer Portfolio
   Live: <a href="https://gmraj11132-tech.github.io/portfolio/" target="_blank" style="color:#a6e3a1">https://gmraj11132-tech.github.io/portfolio/</a>
4. <span style="color:#89b4fa;font-weight:bold">macOS Web OS</span> — Full macOS Sequoia In-Browser Operating System`;
      case 'contact': return `Email:    aryanjaiswal11132@gmail.com
Phone:    +91 8340177620
GitHub:   https://github.com/gmraj11132-tech
LinkedIn: https://www.linkedin.com/in/aryanrajcse
Location: Noida, Alpha 2, India`;
      case 'github': {
        setTimeout(() => openApp('github'), 100);
        return 'Opening GitHub App for @gmraj11132-tech...';
      }
      case 'linkedin': {
        setTimeout(() => openApp('linkedin'), 100);
        return 'Opening LinkedIn App for in/aryanrajcse...';
      }
      case 'hostname': return 'Aryan-MacBook-Pro.local';
      case 'date': return new Date().toString();
      case 'echo': return args.join(' ');
      case 'clear': output.innerHTML = ''; return '';
      case 'cat': {
        const p = args[0]?.startsWith('/') ? args[0] : cwd + '/' + args[0];
        const f = window.macOS.fileSystem.get(p);
        return f && f.type === 'file' ? f.content : `cat: ${args[0]}: No such file`;
      }
      case 'mkdir': {
        if (args[0]) window.macOS.fileSystem.createFolder(cwd, args[0]);
        return '';
      }
      case 'touch': {
        if (args[0]) window.macOS.fileSystem.createFile(cwd, args[0]);
        return '';
      }
      case 'rm': {
        if (args[0]) window.macOS.fileSystem.delete(cwd + '/' + args[0]);
        return '';
      }
      case 'uname': return 'macOS Web Sequoia 15.0 Darwin Kernel 24.0.0 RELEASE_ARM64 arm64';
      case 'neofetch': return `<span style="color:#f38ba8">
       .:'          aryan@macbook-pro
   _ :'_           ─────────────────────────────────
.'\`_\`-'_\`\`.        OS: macOS Web Sequoia 15.0
:________.-'       Host: MacBook Pro 16" (M2 Max)
:_______:          Architect: Aryan Raj (Creator)
 :_______\`-;       Degree: B.Tech CSE (8.0 CGPA)
  \`._.-._.'        College: Techno India University
                   Uptime: 14 days, 8 hours
                   Shell: zsh 5.9 (Apple Silicon)
                   Resolution: ${window.innerWidth}x${window.innerHeight}
                   CPU: Apple M2 Max (12 cores)
                   Memory: 16384 MB Unified
                   GitHub: @gmraj11132-tech
                   LinkedIn: in/aryanrajcse
</span>`;
      case 'help': return 'Available: ls, cd, pwd, whoami, bio, projects, contact, github, linkedin, cat, echo, mkdir, touch, rm, clear, neofetch, open, date, help';
      case 'open': {
        if (args[0] && appRegistry[args[0]]) { setTimeout(() => openApp(args[0]), 100); return `Opening ${args[0]}...`; }
        return `open: ${args[0]}: application not found`;
      }
      case 'history': return history.map((h, i) => `  ${i + 1}  ${h}`).join('\n');
      default: return `zsh: command not found: ${c}`;
    }
  }
}

// --------- CALCULATOR ---------
function generateCalculatorContent() {
  const cid = 'calc-' + Date.now();
  setTimeout(() => initCalcLogic(cid), 100);
  const btn = (label, cls = '') => `<button class="calc-btn ${cls}" data-val="${label}" style="border:none;border-radius:50%;width:52px;height:52px;font-size:20px;cursor:pointer;transition:filter 0.1s" onmousedown="this.style.filter='brightness(0.8)'" onmouseup="this.style.filter=''">${label}</button>`;
  return `<div id="${cid}" style="background:#000;padding:12px;height:100%;display:flex;flex-direction:column;justify-content:flex-end">
    <div class="calc-display" style="color:#fff;font-size:48px;text-align:right;padding:10px 15px;font-weight:300;min-height:60px;overflow:hidden">0</div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:5px">
      ${btn('AC','func')} ${btn('±','func')} ${btn('%','func')} ${btn('÷','op')}
      ${btn('7','num')} ${btn('8','num')} ${btn('9','num')} ${btn('×','op')}
      ${btn('4','num')} ${btn('5','num')} ${btn('6','num')} ${btn('−','op')}
      ${btn('1','num')} ${btn('2','num')} ${btn('3','num')} ${btn('+','op')}
      <button class="calc-btn num" data-val="0" style="border:none;border-radius:26px;grid-column:span 2;height:52px;font-size:20px;cursor:pointer;text-align:left;padding-left:22px">0</button>
      ${btn('.','num')} ${btn('=','op eq')}
    </div>
  </div>`;
}

function initCalcLogic(cid) {
  const el = document.getElementById(cid);
  if (!el) return;
  const display = el.querySelector('.calc-display');
  let current = '0', prev = '', op = '', reset = false;

  // Style buttons
  el.querySelectorAll('.func').forEach(b => { b.style.background = '#a5a5a5'; b.style.color = '#000'; });
  el.querySelectorAll('.num').forEach(b => { b.style.background = '#333'; b.style.color = '#fff'; });
  el.querySelectorAll('.op').forEach(b => { b.style.background = '#ff9f0a'; b.style.color = '#fff'; });

  el.querySelectorAll('.calc-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const v = btn.dataset.val;
      if (v >= '0' && v <= '9') {
        current = (current === '0' || reset) ? v : current + v;
        reset = false;
      } else if (v === '.') {
        if (!current.includes('.')) current += '.';
      } else if (v === 'AC') {
        current = '0'; prev = ''; op = '';
      } else if (v === '±') {
        current = String(-parseFloat(current));
      } else if (v === '%') {
        current = String(parseFloat(current) / 100);
      } else if (v === '=') {
        if (prev && op) {
          current = String(calc(parseFloat(prev), parseFloat(current), op));
          prev = ''; op = '';
        }
      } else {
        if (prev && op && !reset) {
          current = String(calc(parseFloat(prev), parseFloat(current), op));
        }
        prev = current; op = v; reset = true;
      }
      display.textContent = formatNum(current);
    });
  });

  function calc(a, b, o) {
    switch (o) {
      case '+': return a + b;
      case '−': return a - b;
      case '×': return a * b;
      case '÷': return b === 0 ? 'Error' : a / b;
    }
  }
  function formatNum(n) {
    const num = parseFloat(n);
    if (isNaN(num)) return n;
    return num.toLocaleString('en-US', { maximumFractionDigits: 8 });
  }
}

// --------- NOTES ---------
function generateNotesContent() {
  const notes = JSON.parse(localStorage.getItem('macOS_notes') || 'null') || [
    { id: 1, title: 'Welcome to Notes', body: 'Start writing your thoughts here!\n\nYou can create new notes, edit them, and they auto-save.', date: new Date().toLocaleDateString() },
    { id: 2, title: 'Shopping List', body: '- Apples\n- Bread\n- Milk\n- Coffee', date: new Date().toLocaleDateString() }
  ];
  const nid = 'notes-' + Date.now();
  setTimeout(() => initNotesLogic(nid, notes), 100);
  return `<div id="${nid}" style="display:flex;height:100%;font-size:13px">
    <div class="notes-sidebar" style="width:200px;background:#f5f5f5;border-right:1px solid #ddd;display:flex;flex-direction:column">
      <div style="padding:8px;border-bottom:1px solid #ddd"><button class="new-note-btn" style="width:100%;padding:6px;border:none;background:#007AFF;color:#fff;border-radius:6px;cursor:pointer;font-size:12px">+ New Note</button></div>
      <div class="notes-list" style="flex:1;overflow-y:auto"></div>
    </div>
    <div style="flex:1;display:flex;flex-direction:column;background:#fff">
      <div class="note-editor" contenteditable="true" style="flex:1;padding:16px;outline:none;font-size:14px;line-height:1.6;overflow-y:auto">Select or create a note</div>
    </div>
  </div>`;
}

function initNotesLogic(nid, notes) {
  const el = document.getElementById(nid);
  if (!el) return;
  const list = el.querySelector('.notes-list');
  const editor = el.querySelector('.note-editor');
  let activeNote = notes[0];

  function renderList() {
    list.innerHTML = notes.map(n => `<div class="note-item" data-id="${n.id}" style="padding:8px 12px;border-bottom:1px solid #eee;cursor:pointer;${n === activeNote ? 'background:#cce3ff;' : ''}" onmouseover="if(this.style.background!=='rgb(204, 227, 255)')this.style.background='#eee'" onmouseout="if(this.style.background!=='rgb(204, 227, 255)')this.style.background=''">
      <div style="font-weight:600;font-size:13px">${n.title}</div>
      <div style="font-size:11px;color:#888;margin-top:2px">${n.date}</div>
    </div>`).join('');
    list.querySelectorAll('.note-item').forEach(item => {
      item.addEventListener('click', () => {
        activeNote = notes.find(n => n.id == item.dataset.id);
        editor.innerText = activeNote.body;
        renderList();
      });
    });
  }

  editor.innerText = activeNote ? activeNote.body : '';
  editor.addEventListener('input', () => {
    if (activeNote) {
      activeNote.body = editor.innerText;
      activeNote.title = editor.innerText.split('\n')[0].substring(0, 40) || 'Untitled';
      localStorage.setItem('macOS_notes', JSON.stringify(notes));
      renderList();
    }
  });

  el.querySelector('.new-note-btn').addEventListener('click', () => {
    const n = { id: Date.now(), title: 'New Note', body: '', date: new Date().toLocaleDateString() };
    notes.unshift(n);
    activeNote = n;
    editor.innerText = '';
    editor.focus();
    renderList();
  });

  renderList();
}

// --------- TEXT EDIT ---------
function generateTextEditContent() {
  return `<div style="display:flex;flex-direction:column;height:100%">
    <div style="padding:6px 10px;background:#f5f5f5;border-bottom:1px solid #ddd;display:flex;gap:6px;align-items:center">
      <button onclick="document.execCommand('bold')" style="border:none;background:none;cursor:pointer;font-weight:bold;font-size:14px;padding:4px 8px;border-radius:4px" onmouseover="this.style.background='#ddd'" onmouseout="this.style.background=''">B</button>
      <button onclick="document.execCommand('italic')" style="border:none;background:none;cursor:pointer;font-style:italic;font-size:14px;padding:4px 8px;border-radius:4px" onmouseover="this.style.background='#ddd'" onmouseout="this.style.background=''">I</button>
      <button onclick="document.execCommand('underline')" style="border:none;background:none;cursor:pointer;text-decoration:underline;font-size:14px;padding:4px 8px;border-radius:4px" onmouseover="this.style.background='#ddd'" onmouseout="this.style.background=''">U</button>
      <span style="width:1px;height:18px;background:#ccc"></span>
      <button onclick="document.execCommand('justifyLeft')" style="border:none;background:none;cursor:pointer;font-size:12px;padding:4px 8px;border-radius:4px">⫷</button>
      <button onclick="document.execCommand('justifyCenter')" style="border:none;background:none;cursor:pointer;font-size:12px;padding:4px 8px;border-radius:4px">☰</button>
      <button onclick="document.execCommand('justifyRight')" style="border:none;background:none;cursor:pointer;font-size:12px;padding:4px 8px;border-radius:4px">⫸</button>
      <span style="flex:1"></span>
      <span class="textedit-wordcount" style="font-size:11px;color:#888">0 words</span>
    </div>
    <div contenteditable="true" style="flex:1;padding:20px 30px;outline:none;font-size:14px;line-height:1.7;overflow-y:auto;background:#fff" oninput="const wc=this.innerText.trim().split(/\\s+/).filter(w=>w).length;this.parentElement.querySelector('.textedit-wordcount').textContent=wc+' words'">Start typing...</div>
  </div>`;
}

// --------- SETTINGS ---------
function generateSettingsContent() {
  return `<div style="display:flex;height:100%;font-size:13px">
    <div style="width:220px;background:#f5f5f5;border-right:1px solid #ddd;padding:10px;overflow-y:auto">
      <div style="font-size:11px;font-weight:600;color:#888;padding:4px 8px;margin-bottom:4px">General</div>
      <div style="padding:6px 10px;border-radius:6px;cursor:pointer;display:flex;align-items:center;gap:8px;background:#007AFF;color:#fff"><i class="fa-solid fa-paintbrush" style="width:16px"></i> Appearance</div>
      <div style="padding:6px 10px;border-radius:6px;cursor:pointer;display:flex;align-items:center;gap:8px;margin-top:2px" onmouseover="this.style.background='#e8e8e8'" onmouseout="this.style.background=''"><i class="fa-solid fa-desktop" style="width:16px;color:#007AFF"></i> Desktop & Dock</div>
      <div style="padding:6px 10px;border-radius:6px;cursor:pointer;display:flex;align-items:center;gap:8px;margin-top:2px" onmouseover="this.style.background='#e8e8e8'" onmouseout="this.style.background=''"><i class="fa-solid fa-display" style="width:16px;color:#007AFF"></i> Displays</div>
      <div style="padding:6px 10px;border-radius:6px;cursor:pointer;display:flex;align-items:center;gap:8px;margin-top:2px" onmouseover="this.style.background='#e8e8e8'" onmouseout="this.style.background=''"><i class="fa-solid fa-volume-high" style="width:16px;color:#FF2D55"></i> Sound</div>
      <div style="font-size:11px;font-weight:600;color:#888;padding:4px 8px;margin-top:12px;margin-bottom:4px">Network</div>
      <div style="padding:6px 10px;border-radius:6px;cursor:pointer;display:flex;align-items:center;gap:8px" onmouseover="this.style.background='#e8e8e8'" onmouseout="this.style.background=''"><i class="fa-solid fa-wifi" style="width:16px;color:#007AFF"></i> Wi-Fi</div>
      <div style="padding:6px 10px;border-radius:6px;cursor:pointer;display:flex;align-items:center;gap:8px;margin-top:2px" onmouseover="this.style.background='#e8e8e8'" onmouseout="this.style.background=''"><i class="fa-brands fa-bluetooth-b" style="width:16px;color:#007AFF"></i> Bluetooth</div>
      <div style="font-size:11px;font-weight:600;color:#888;padding:4px 8px;margin-top:12px;margin-bottom:4px">About</div>
      <div style="padding:6px 10px;border-radius:6px;cursor:pointer;display:flex;align-items:center;gap:8px" onmouseover="this.style.background='#e8e8e8'" onmouseout="this.style.background=''"><i class="fa-brands fa-apple" style="width:16px;color:#666"></i> About This Mac</div>
    </div>
    <div style="flex:1;padding:24px;overflow-y:auto;background:#fff">
      <h2 style="margin:0 0 20px;font-size:22px;color:#333">Appearance</h2>
      <div style="margin-bottom:20px"><label style="font-weight:600;display:block;margin-bottom:8px">Accent Color</label>
        <div style="display:flex;gap:8px">${['#007AFF','#AF52DE','#FF2D55','#FF3B30','#FF9500','#FFCC00','#34C759','#8E8E93'].map(c => `<div style="width:24px;height:24px;border-radius:50%;background:${c};cursor:pointer;border:2px solid ${c === window.macOS.settings.accentColor ? '#333' : 'transparent'}" onclick="window.macOS.settings.accentColor='${c}';document.documentElement.style.setProperty('--system-blue','${c}')"></div>`).join('')}</div>
      </div>
      <div style="margin-bottom:20px"><label style="font-weight:600;display:block;margin-bottom:8px">Mode</label>
        <div style="display:flex;gap:12px">
          <div style="text-align:center;cursor:pointer"><div style="width:80px;height:50px;border-radius:8px;background:linear-gradient(135deg,#f5f5f7,#e8e8ed);border:2px solid #007AFF"></div><div style="font-size:11px;margin-top:4px">Light</div></div>
          <div style="text-align:center;cursor:pointer"><div style="width:80px;height:50px;border-radius:8px;background:linear-gradient(135deg,#2c2c2e,#1c1c1e);border:2px solid transparent"></div><div style="font-size:11px;margin-top:4px">Dark</div></div>
        </div>
      </div>
      <div style="margin-bottom:20px"><label style="font-weight:600;display:block;margin-bottom:8px">Wallpaper</label>
        <div style="display:flex;gap:10px;flex-wrap:wrap">${[
          'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',
          'linear-gradient(135deg,#f093fb 0%,#f5576c 100%)',
          'linear-gradient(135deg,#4facfe 0%,#00f2fe 100%)',
          'linear-gradient(135deg,#43e97b 0%,#38f9d7 100%)',
          'linear-gradient(135deg,#fa709a 0%,#fee140 100%)',
          'linear-gradient(135deg,#a18cd1 0%,#fbc2eb 100%)'
        ].map((g, i) => `<div style="width:80px;height:50px;border-radius:8px;background:${g};cursor:pointer;border:2px solid transparent" onclick="document.getElementById('desktop-screen').style.background='${g}';this.parentElement.querySelectorAll('div').forEach(d=>d.style.borderColor='transparent');this.style.borderColor='#007AFF'"></div>`).join('')}</div>
      </div>
    </div>
  </div>`;
}

// --------- CALENDAR ---------
function generateCalendarContent() {
  const now = new Date();
  const month = now.getMonth(), year = now.getFullYear();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = now.getDate();
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  let cells = '';
  for (let i = 0; i < firstDay; i++) cells += '<div style="padding:8px;text-align:center;color:#ccc"></div>';
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = d === today;
    cells += `<div style="padding:8px;text-align:center;border-radius:50%;cursor:pointer;${isToday ? 'background:#007AFF;color:#fff;font-weight:600' : 'color:#333'}" onmouseover="if(!${isToday})this.style.background='#e8e8e8'" onmouseout="if(!${isToday})this.style.background=''">${d}</div>`;
  }

  return `<div style="display:flex;height:100%">
    <div style="width:180px;background:#f5f5f5;border-right:1px solid #ddd;padding:12px">
      <div style="font-size:18px;font-weight:700;color:#FF3B30">${monthNames[month]}</div>
      <div style="font-size:48px;font-weight:200;color:#333">${today}</div>
      <div style="font-size:13px;color:#666">${dayNames[now.getDay()]}, ${year}</div>
    </div>
    <div style="flex:1;padding:16px;background:#fff;display:flex;flex-direction:column">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <span style="font-size:18px;font-weight:600">${monthNames[month]} ${year}</span>
        <div><button style="border:none;background:none;cursor:pointer;font-size:16px;padding:4px 8px">◀</button><button style="border:none;background:none;cursor:pointer;font-size:16px;padding:4px 8px">▶</button></div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px">
        ${dayNames.map(d => `<div style="text-align:center;font-size:11px;font-weight:600;color:#888;padding:4px">${d}</div>`).join('')}
        ${cells}
      </div>
    </div>
  </div>`;
}

// --------- PHOTOS ---------
function generatePhotosContent() {
  const gradients = [
    'linear-gradient(135deg,#667eea,#764ba2)','linear-gradient(135deg,#f093fb,#f5576c)',
    'linear-gradient(135deg,#4facfe,#00f2fe)','linear-gradient(135deg,#43e97b,#38f9d7)',
    'linear-gradient(135deg,#fa709a,#fee140)','linear-gradient(135deg,#a18cd1,#fbc2eb)',
    'linear-gradient(135deg,#ffecd2,#fcb69f)','linear-gradient(135deg,#ff9a9e,#fecfef)',
    'linear-gradient(135deg,#89f7fe,#66a6ff)','linear-gradient(135deg,#fddb92,#d1fdff)',
    'linear-gradient(135deg,#c1dfc4,#deecdd)','linear-gradient(135deg,#e0c3fc,#8ec5fc)'
  ];
  const photos = gradients.map((g, i) => `<div style="aspect-ratio:1;background:${g};border-radius:4px;cursor:pointer" onclick="this.style.transform=this.style.transform==='scale(0.95)'?'scale(1)':'scale(0.95)';this.style.transition='transform 0.2s'"></div>`).join('');

  return `<div style="display:flex;height:100%">
    <div style="width:160px;background:#f5f5f5;border-right:1px solid #ddd;padding:10px;font-size:13px">
      <div style="font-size:11px;font-weight:600;color:#888;margin-bottom:6px">Library</div>
      <div style="padding:5px 8px;border-radius:5px;background:#cce3ff;cursor:pointer">All Photos</div>
      <div style="padding:5px 8px;border-radius:5px;cursor:pointer;margin-top:2px">Favorites</div>
      <div style="padding:5px 8px;border-radius:5px;cursor:pointer;margin-top:2px">Recently Added</div>
      <div style="padding:5px 8px;border-radius:5px;cursor:pointer;margin-top:2px">Screenshots</div>
    </div>
    <div style="flex:1;padding:12px;background:#fff;overflow-y:auto">
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:3px">${photos}</div>
    </div>
  </div>`;
}

// --------- MUSIC ---------
function generateMusicContent() {
  const songs = [
    { title: 'Midnight Drive', artist: 'The Synthwave', album: 'Neon Nights', duration: '3:42' },
    { title: 'Ocean Breeze', artist: 'Chill Waves', album: 'Calm Waters', duration: '4:15' },
    { title: 'Electric Dreams', artist: 'Retro Future', album: 'Digital Age', duration: '3:58' },
    { title: 'Sunset Boulevard', artist: 'Jazz Collective', album: 'City Lights', duration: '5:21' },
    { title: 'Mountain Echo', artist: 'Nature Sounds', album: 'Earth Tones', duration: '4:33' },
    { title: 'Tokyo Nights', artist: 'Lo-Fi Beats', album: 'Chill Hop', duration: '3:15' },
    { title: 'Summer Rain', artist: 'Acoustic Dreams', album: 'Seasons', duration: '4:02' },
    { title: 'Stargazer', artist: 'Cosmos', album: 'Infinite Space', duration: '6:10' }
  ];
  const rows = songs.map((s, i) => `<div style="display:grid;grid-template-columns:30px 2fr 1fr 1fr 60px;padding:8px 12px;font-size:13px;cursor:pointer;border-radius:4px;color:#333" onmouseover="this.style.background='#f0f0f0'" onmouseout="this.style.background=''">
    <span style="color:#888">${i + 1}</span><span style="font-weight:500">${s.title}</span><span style="color:#888">${s.artist}</span><span style="color:#888">${s.album}</span><span style="color:#888;text-align:right">${s.duration}</span>
  </div>`).join('');

  return `<div style="display:flex;flex-direction:column;height:100%">
    <div style="display:flex;flex:1">
      <div style="width:180px;background:#f5f5f5;border-right:1px solid #ddd;padding:10px;font-size:13px">
        <div style="font-size:11px;font-weight:600;color:#888;margin-bottom:6px">Library</div>
        <div style="padding:5px 8px;border-radius:5px;background:#cce3ff;cursor:pointer">Songs</div>
        <div style="padding:5px 8px;border-radius:5px;cursor:pointer;margin-top:2px">Artists</div>
        <div style="padding:5px 8px;border-radius:5px;cursor:pointer;margin-top:2px">Albums</div>
        <div style="padding:5px 8px;border-radius:5px;cursor:pointer;margin-top:2px">Recently Added</div>
      </div>
      <div style="flex:1;background:#fff;overflow-y:auto">
        <div style="display:grid;grid-template-columns:30px 2fr 1fr 1fr 60px;padding:8px 12px;font-size:11px;font-weight:600;color:#888;border-bottom:1px solid #eee">
          <span>#</span><span>Title</span><span>Artist</span><span>Album</span><span style="text-align:right">Time</span>
        </div>
        ${rows}
      </div>
    </div>
    <div style="padding:8px 16px;background:#f5f5f5;border-top:1px solid #ddd;display:flex;align-items:center;gap:12px">
      <div style="width:36px;height:36px;border-radius:4px;background:linear-gradient(135deg,#667eea,#764ba2)"></div>
      <div style="flex:0 0 auto"><div style="font-size:12px;font-weight:600">Midnight Drive</div><div style="font-size:11px;color:#888">The Synthwave</div></div>
      <div style="flex:1;display:flex;justify-content:center;gap:16px;align-items:center">
        <i class="fa-solid fa-backward-step" style="cursor:pointer;color:#333"></i>
        <i class="fa-solid fa-play" style="cursor:pointer;color:#333;font-size:18px"></i>
        <i class="fa-solid fa-forward-step" style="cursor:pointer;color:#333"></i>
      </div>
      <div style="display:flex;align-items:center;gap:6px"><i class="fa-solid fa-volume-high" style="color:#888;font-size:11px"></i><input type="range" min="0" max="100" value="70" style="width:80px"></div>
    </div>
  </div>`;
}

// --------- APP STORE ---------
function generateAppStoreContent() {
  const apps = [
    { name: 'To-Do List', icon: 'fa-list-check', color: '#34C759', cat: 'Productivity', desc: 'Stay organized with tasks' },
    { name: 'Pomodoro Timer', icon: 'fa-clock', color: '#FF3B30', cat: 'Productivity', desc: 'Focus with timed sessions' },
    { name: 'Code Editor', icon: 'fa-code', color: '#AF52DE', cat: 'Developer', desc: 'Write code anywhere' },
    { name: 'Color Picker', icon: 'fa-palette', color: '#FF9500', cat: 'Utilities', desc: 'Pick any color' },
    { name: 'Chess', icon: 'fa-chess', color: '#8E8E93', cat: 'Games', desc: 'Classic board game' },
    { name: 'Unit Converter', icon: 'fa-ruler', color: '#007AFF', cat: 'Utilities', desc: 'Convert any unit' }
  ];
  const cards = apps.map(a => `<div style="background:#fff;border-radius:12px;padding:16px;display:flex;gap:12px;align-items:center;box-shadow:0 1px 3px rgba(0,0,0,0.1)">
    <div style="width:50px;height:50px;border-radius:12px;background:${a.color};display:flex;align-items:center;justify-content:center;color:#fff;font-size:22px"><i class="fa-solid ${a.icon}"></i></div>
    <div style="flex:1"><div style="font-weight:600;font-size:14px">${a.name}</div><div style="font-size:11px;color:#888;margin-top:2px">${a.desc}</div><div style="font-size:10px;color:#aaa">${a.cat}</div></div>
    <button style="border:none;background:#007AFF;color:#fff;padding:6px 16px;border-radius:14px;cursor:pointer;font-size:12px;font-weight:600" onclick="this.textContent='Installing...';setTimeout(()=>{this.textContent='Open';this.style.background='#e0e0e0';this.style.color='#007AFF'},1500)">Get</button>
  </div>`).join('');

  return `<div style="height:100%;overflow-y:auto;background:#f5f5f7;padding:20px">
    <div style="background:linear-gradient(135deg,#667eea,#764ba2);border-radius:14px;padding:30px;color:#fff;margin-bottom:20px">
      <div style="font-size:12px;font-weight:600;text-transform:uppercase;opacity:0.8">Featured</div>
      <div style="font-size:28px;font-weight:700;margin-top:4px">Discover Amazing Apps</div>
      <div style="font-size:14px;opacity:0.9;margin-top:4px">Hand-picked apps for your Mac</div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px">${cards}</div>
  </div>`;
}

// --------- MAPS ---------
function generateMapsContent() {
  return `<div style="height:100%;display:flex;flex-direction:column">
    <div style="padding:8px;background:#f5f5f7;border-bottom:1px solid #ddd;display:flex;gap:8px">
      <input type="text" placeholder="Search Maps" style="flex:1;padding:6px 14px;border-radius:18px;border:1px solid #ccc;outline:none;font-size:13px">
    </div>
    <div style="flex:1;background:linear-gradient(135deg,#e8f4f8,#d1ecf1);display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden">
      <div style="position:absolute;inset:0;background-image:repeating-linear-gradient(0deg,transparent,transparent 49px,#c8dde6 49px,#c8dde6 50px),repeating-linear-gradient(90deg,transparent,transparent 49px,#c8dde6 49px,#c8dde6 50px);opacity:0.5"></div>
      <div style="text-align:center;z-index:1"><div style="font-size:48px;margin-bottom:8px">📍</div><div style="font-size:16px;color:#333;font-weight:600">Cupertino, CA</div><div style="font-size:13px;color:#666">Apple Park</div></div>
    </div>
  </div>`;
}

// --------- MESSAGES ---------
function generateMessagesContent() {
  return `<div style="display:flex;height:100%;font-size:13px">
    <div style="width:220px;background:#f5f5f5;border-right:1px solid #ddd;overflow-y:auto">
      <div style="padding:8px"><input type="text" placeholder="Search" style="width:100%;padding:6px 12px;border-radius:14px;border:1px solid #ddd;outline:none;font-size:12px;box-sizing:border-box"></div>
      ${[{name:'John',msg:'Hey, how are you?',time:'9:41 AM',color:'#007AFF'},{name:'Sarah',msg:'See you tomorrow!',time:'Yesterday',color:'#34C759'},{name:'Mike',msg:'Thanks for the help',time:'Mon',color:'#FF9500'}].map((c, i) => `<div style="padding:10px 12px;display:flex;gap:10px;align-items:center;cursor:pointer;${i===0?'background:#cce3ff;':''}border-bottom:1px solid #eee" onmouseover="if(${i}!==0)this.style.background='#eee'" onmouseout="if(${i}!==0)this.style.background=''">
        <div style="width:36px;height:36px;border-radius:50%;background:${c.color};display:flex;align-items:center;justify-content:center;color:#fff;font-weight:600;font-size:14px;flex-shrink:0">${c.name[0]}</div>
        <div style="flex:1;min-width:0"><div style="display:flex;justify-content:space-between"><span style="font-weight:600">${c.name}</span><span style="font-size:11px;color:#888">${c.time}</span></div><div style="font-size:12px;color:#888;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${c.msg}</div></div>
      </div>`).join('')}
    </div>
    <div style="flex:1;display:flex;flex-direction:column;background:#fff">
      <div style="padding:10px 16px;border-bottom:1px solid #ddd;font-weight:600">John</div>
      <div style="flex:1;padding:16px;overflow-y:auto;display:flex;flex-direction:column;gap:8px">
        <div style="align-self:flex-start;background:#e5e5ea;padding:8px 14px;border-radius:18px;max-width:70%;font-size:14px">Hey! How's the project going?</div>
        <div style="align-self:flex-end;background:#007AFF;color:#fff;padding:8px 14px;border-radius:18px;max-width:70%;font-size:14px">Going great! Almost done with the UI</div>
        <div style="align-self:flex-start;background:#e5e5ea;padding:8px 14px;border-radius:18px;max-width:70%;font-size:14px">Awesome! Can't wait to see it 🎉</div>
        <div style="align-self:flex-end;background:#007AFF;color:#fff;padding:8px 14px;border-radius:18px;max-width:70%;font-size:14px">I'll show you tomorrow!</div>
      </div>
      <div style="padding:8px 12px;border-top:1px solid #ddd;display:flex;gap:8px">
        <input type="text" placeholder="iMessage" style="flex:1;padding:8px 14px;border-radius:18px;border:1px solid #ddd;outline:none;font-size:13px">
        <button style="border:none;background:#007AFF;color:#fff;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:14px"><i class="fa-solid fa-arrow-up"></i></button>
      </div>
    </div>
  </div>`;
}

// --------- MAIL ---------
function generateMailContent() {
  const emails = [
    { from: 'Apple', subject: 'Your Apple ID was used to sign in', preview: 'Your Apple ID was recently used...', time: '9:30 AM', unread: true },
    { from: 'GitHub', subject: 'Security alert: new sign-in', preview: 'A new sign-in was detected...', time: 'Yesterday', unread: true },
    { from: 'Newsletter', subject: 'Weekly Tech Digest', preview: 'Top stories this week in tech...', time: 'Mon', unread: false },
    { from: 'Support', subject: 'Your ticket has been resolved', preview: 'Hello, we are happy to inform...', time: 'Sep 28', unread: false }
  ];
  const emailList = emails.map((e, i) => `<div style="padding:10px 12px;border-bottom:1px solid #eee;cursor:pointer;${i===0?'background:#cce3ff;':''}display:flex;gap:8px" onmouseover="if(${i}!==0)this.style.background='#f5f5f5'" onmouseout="if(${i}!==0)this.style.background=''">
    ${e.unread ? '<div style="width:8px;height:8px;border-radius:50%;background:#007AFF;flex-shrink:0;margin-top:6px"></div>' : '<div style="width:8px"></div>'}
    <div style="flex:1;min-width:0"><div style="font-weight:${e.unread?'600':'400'};font-size:13px">${e.from}</div><div style="font-size:12px;color:#333">${e.subject}</div><div style="font-size:11px;color:#888;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${e.preview}</div></div>
    <div style="font-size:11px;color:#888;flex-shrink:0">${e.time}</div>
  </div>`).join('');

  return `<div style="display:flex;height:100%;font-size:13px">
    <div style="width:160px;background:#f5f5f5;border-right:1px solid #ddd;padding:8px;font-size:12px">
      <div style="padding:5px 8px;border-radius:5px;background:#007AFF;color:#fff;cursor:pointer;display:flex;justify-content:space-between">Inbox <span style="background:rgba(255,255,255,0.3);padding:0 6px;border-radius:10px;font-size:11px">2</span></div>
      <div style="padding:5px 8px;border-radius:5px;cursor:pointer;margin-top:2px">Drafts</div>
      <div style="padding:5px 8px;border-radius:5px;cursor:pointer;margin-top:2px">Sent</div>
      <div style="padding:5px 8px;border-radius:5px;cursor:pointer;margin-top:2px">Junk</div>
      <div style="padding:5px 8px;border-radius:5px;cursor:pointer;margin-top:2px">Trash</div>
    </div>
    <div style="width:280px;border-right:1px solid #ddd;overflow-y:auto;background:#fff">
      <div style="padding:8px;border-bottom:1px solid #ddd"><input type="text" placeholder="Search" style="width:100%;padding:5px 10px;border-radius:12px;border:1px solid #ddd;outline:none;font-size:12px;box-sizing:border-box"></div>
      ${emailList}
    </div>
    <div style="flex:1;padding:20px;background:#fff;overflow-y:auto">
      <div style="font-size:18px;font-weight:600;margin-bottom:4px">Your Apple ID was used to sign in</div>
      <div style="font-size:13px;color:#888;margin-bottom:16px">From: <strong>Apple</strong> &lt;no-reply@apple.com&gt; — 9:30 AM</div>
      <div style="font-size:14px;line-height:1.6;color:#333">Dear User,<br><br>Your Apple ID (admin@macbook-web.local) was used to sign in to iCloud via a web browser.<br><br>Date: ${new Date().toLocaleDateString()}<br>Browser: Safari<br>Operating System: macOS Web 15.0<br><br>If you didn't make this request, please change your password immediately.<br><br>Best regards,<br>Apple Support</div>
    </div>
  </div>`;
}

// --------- WEATHER ---------
function generateWeatherContent() {
  return `<div style="height:100%;background:linear-gradient(180deg,#4A90D9 0%,#67B8F0 50%,#9DCDF0 100%);color:#fff;padding:24px;overflow-y:auto;display:flex;flex-direction:column">
    <div style="text-align:center;margin-bottom:24px">
      <div style="font-size:14px;font-weight:500;opacity:0.9">Cupertino, CA</div>
      <div style="font-size:72px;font-weight:200;margin:4px 0">72°</div>
      <div style="font-size:16px;opacity:0.9">☀️ Sunny</div>
      <div style="font-size:13px;opacity:0.7;margin-top:4px">H:78° L:62°</div>
    </div>
    <div style="background:rgba(255,255,255,0.15);border-radius:12px;padding:14px;margin-bottom:16px;backdrop-filter:blur(10px)">
      <div style="font-size:12px;font-weight:600;opacity:0.8;margin-bottom:10px">HOURLY FORECAST</div>
      <div style="display:flex;gap:16px;overflow-x:auto;padding-bottom:4px">
        ${['Now:72°:☀️','1PM:74°:☀️','2PM:75°:🌤','3PM:76°:🌤','4PM:78°:☀️','5PM:76°:🌤','6PM:73°:🌅','7PM:70°:🌙'].map(h => {
          const [t,temp,icon] = h.split(':');
          return `<div style="text-align:center;min-width:50px"><div style="font-size:12px;font-weight:500">${t}</div><div style="font-size:20px;margin:6px 0">${icon}</div><div style="font-size:13px;font-weight:500">${temp}</div></div>`;
        }).join('')}
      </div>
    </div>
    <div style="background:rgba(255,255,255,0.15);border-radius:12px;padding:14px;margin-bottom:16px;backdrop-filter:blur(10px)">
      <div style="font-size:12px;font-weight:600;opacity:0.8;margin-bottom:10px">10-DAY FORECAST</div>
      ${['Today:☀️:78°:62°','Tomorrow:🌤:76°:60°','Wed:☁️:70°:58°','Thu:🌧:65°:55°','Fri:☀️:72°:59°','Sat:☀️:75°:61°','Sun:🌤:74°:60°'].map(d => {
        const [day,icon,hi,lo] = d.split(':');
        return `<div style="display:flex;align-items:center;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.1)"><span style="width:70px;font-size:13px">${day}</span><span style="font-size:18px;width:30px">${icon}</span><span style="flex:1"></span><span style="font-size:13px;opacity:0.7;width:35px">${lo}</span><div style="width:60px;height:4px;border-radius:2px;background:linear-gradient(90deg,#60a5fa,#f59e0b);margin:0 8px"></div><span style="font-size:13px;width:35px">${hi}</span></div>`;
      }).join('')}
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      ${[['Feels Like','74°'],['Humidity','45%'],['Wind','6 mph'],['UV Index','5 Moderate'],['Visibility','10 mi'],['Pressure','29.92 in']].map(([label,val]) =>
        `<div style="background:rgba(255,255,255,0.15);border-radius:12px;padding:14px;backdrop-filter:blur(10px)"><div style="font-size:11px;font-weight:600;opacity:0.7;text-transform:uppercase">${label}</div><div style="font-size:22px;font-weight:500;margin-top:6px">${val}</div></div>`
      ).join('')}
    </div>
  </div>`;
}

// --------- ABOUT THIS MAC (ARYAN RAJ EDITION) ---------
function generateAboutContent(initialTab = 'overview') {
  const aid = 'about-' + Date.now();
  setTimeout(() => initAboutLogic(aid, initialTab), 50);

  const certs = [
    { title: "IIT BHU Varanasi", desc: "Cybersecurity & Cryptography Engineering", file: "assets/cert_iitbhu.jpg" },
    { title: "IBM Cognitive Class", desc: "Python for Data Science & AI", file: "assets/cert_ibm_python.jpg" },
    { title: "Siemens Healthineers", desc: "Engineering Automation & Innovation", file: "assets/cert_siemens.jpg" },
    { title: "Tata Forage", desc: "Data Visualization & Predictive Insights", file: "assets/cert_tata_forage.jpg" },
    { title: "InternPe", desc: "Full Stack Software Development", file: "assets/cert_internpe.jpg" },
    { title: "Prodigy InfoTech", desc: "Software Development & Architecture", file: "assets/cert_prodigy.jpg" },
    { title: "NV Enterprises", desc: "Enterprise Full Stack Systems", file: "assets/cert_nv_enterprises.jpg" },
    { title: "BIS MyGov", desc: "Bureau of Indian Standards National Certification", file: "assets/cert_bis_mygov.jpg" },
    { title: "Swayam NPTEL", desc: "Financial Systems & Numerical Analysis", file: "assets/cert_swayam_finance.jpg" },
    { title: "Johnson & Johnson", desc: "Corporate Technology & Strategic Operations", file: "assets/cert_jnj.jpg" },
    { title: "ExcelR Solutions", desc: "Data Science & Analytical Computing", file: "assets/cert_excelrs.jpg" },
    { title: "MyGov India", desc: "National Technical & Innovation Challenge", file: "assets/cert_mygov.jpg" }
  ];

  const projects = [
    {
      name: "CareerPilot AI",
      sub: "Smart Placement & Resume ATS Suite",
      desc: "Full-stack campus placement suite. Features multi-stage PDF/DOCX resume parsing, 0–100 ATS scoring matrix, JD match algorithm, and role-tailored mock interview prep with hybrid AI & offline fallback.",
      img: "assets/careerpilot_thumbnail.png",
      tags: ["Next.js 16", "TypeScript", "Gemini 2.5 Flash", "ATS Scoring"],
      live: "https://careerpilot-green-three.vercel.app",
      source: "https://github.com/gmraj11132-tech/careerpilot-ai-resume-analyzer"
    },
    {
      name: "ScamShield AI",
      sub: "Multi-Vector Cyber Threat & Fraud Signal Analysis Platform",
      desc: "Production cybersecurity platform analyzing deceptive SMS, spoofed emails, malicious typosquatting URLs, and fraudulent screenshots. Features a hybrid dual-engine (Gemini 2.5 Flash + offline deterministic rules), in-browser OCR, and safe verification protocols.",
      img: "assets/scamshield_thumbnail.png",
      tags: ["React 19", "TypeScript", "Threat Intel", "OCR Scanner"],
      live: "https://gmraj11132-tech.github.io/scamshield-ai/",
      source: "https://github.com/gmraj11132-tech/scamshield-ai"
    },
    {
      name: "AryanOS Portfolio",
      sub: "MacBook OS Crystal Glassmorphism Developer Portfolio",
      desc: "High-performance portfolio simulating macOS Sequoia with specular glass sheen, spring haptic press scaling, interactive in-app browser modals, zero-lag ambient mesh, and AJAX direct mail pipeline.",
      img: "assets/profile.jpg",
      tags: ["HTML5", "Modern CSS3", "JavaScript ES6+", "120Hz Ambient Mesh"],
      live: "https://gmraj11132-tech.github.io/portfolio/",
      source: "https://github.com/gmraj11132-tech/portfolio"
    },
    {
      name: "macOS Web OS",
      sub: "Apple Sequoia In-Browser Operating System",
      desc: "Full-featured web operating system with authentic boot sequence, lock screen, window manager with traffic lights, dock magnification, Spotlight search, control center, and native apps.",
      img: "assets/profile.jpg",
      tags: ["Full Stack", "Window Manager", "Node.js Express", "Apple Aesthetics"],
      live: "#",
      source: "https://github.com/gmraj11132-tech/macos-web-os"
    }
  ];

  return `
  <div id="${aid}" class="about-mac-window">
    <div class="about-mac-tabs">
      <button class="about-tab-btn active" data-tab="overview"><i class="fa-brands fa-apple"></i> Overview</button>
      <button class="about-tab-btn" data-tab="projects"><i class="fa-solid fa-rocket"></i> Projects</button>
      <button class="about-tab-btn" data-tab="credentials"><i class="fa-solid fa-award"></i> 12 Credentials</button>
      <button class="about-tab-btn" data-tab="resume"><i class="fa-solid fa-file-invoice"></i> Resume</button>
      <button class="about-tab-btn" data-tab="specs"><i class="fa-solid fa-microchip"></i> Hardware & Display</button>
    </div>

    <div class="about-tab-content">
      <!-- TAB 1: OVERVIEW -->
      <div class="about-tab-panel" data-panel="overview">
        <div style="display: flex; gap: 28px; align-items: flex-start;">
          <div style="text-align: center; flex-shrink: 0;">
            <div style="position: relative; display: inline-block;">
              <img src="assets/profile.jpg" alt="Aryan Raj" style="width: 125px; height: 125px; border-radius: 50%; object-fit: cover; box-shadow: 0 8px 24px rgba(0,0,0,0.18); border: 3px solid #007aff;">
              <div style="position: absolute; bottom: 4px; right: 4px; background: #34c759; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; border: 2px solid white;">
                <i class="fa-solid fa-check"></i>
              </div>
            </div>
            <div style="font-size: 11px; color: #86868b; margin-top: 8px; font-weight: 500;">BUILD 24A335 • SEQUOIA</div>
          </div>

          <div style="flex: 1;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
              <span style="font-size: 26px; font-weight: 700; color: #1d1d1f; letter-spacing: -0.5px;">Aryan Raj</span>
              <span style="background: rgba(0, 122, 255, 0.1); color: #007aff; padding: 2px 10px; border-radius: 12px; font-size: 11px; font-weight: 600;">System Architect & Creator</span>
            </div>
            <div style="font-size: 13px; color: #0071e3; font-weight: 500; margin-bottom: 12px;">
              B.Tech Computer Science & Engineering (4th Year, 8.0 CGPA) • Techno India University
            </div>

            <div style="background: #ffffff; border: 1px solid #e5e5ea; border-radius: 12px; padding: 14px 16px; margin-bottom: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
              <div style="font-size: 13px; font-weight: 600; color: #1d1d1f; margin-bottom: 6px;">Biography & Creator Dossier</div>
              <p style="font-size: 13px; line-height: 1.6; color: #424245; margin: 0 0 8px;">
                I am <b>Aryan Raj</b>, an aspiring Software Engineer, Full Stack Developer, and AI Developer based in <b>Noida Alpha 2, India</b>. I built this entire <b>macOS Web Operating System</b> from scratch to bring a fast, fluid, and authentic Apple desktop environment to the web browser.
              </p>
              <p style="font-size: 13px; line-height: 1.6; color: #424245; margin: 0;">
                I specialize in modern AI integrations (Gemini API, LangChain), full-stack frameworks (Next.js 16, React 19, TypeScript), systems programming, and high-performance glassmorphic UI engineering.
              </p>
            </div>

            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 18px;">
              <div style="background: #ffffff; border: 1px solid #e5e5ea; border-radius: 8px; padding: 8px 12px;">
                <div style="font-size: 10px; color: #86868b; text-transform: uppercase; font-weight: 600;">Operating System</div>
                <div style="font-size: 13px; font-weight: 600; color: #1d1d1f; margin-top: 2px;">macOS Web Sequoia 15.0</div>
              </div>
              <div style="background: #ffffff; border: 1px solid #e5e5ea; border-radius: 8px; padding: 8px 12px;">
                <div style="font-size: 10px; color: #86868b; text-transform: uppercase; font-weight: 600;">Engine / Processor</div>
                <div style="font-size: 13px; font-weight: 600; color: #1d1d1f; margin-top: 2px;">Apple M2 Max (16 GB Unified RAM)</div>
              </div>
              <div style="background: #ffffff; border: 1px solid #e5e5ea; border-radius: 8px; padding: 8px 12px;">
                <div style="font-size: 10px; color: #86868b; text-transform: uppercase; font-weight: 600;">College & Academic</div>
                <div style="font-size: 13px; font-weight: 600; color: #1d1d1f; margin-top: 2px;">Techno India Univ • 8.0 CGPA</div>
              </div>
              <div style="background: #ffffff; border: 1px solid #e5e5ea; border-radius: 8px; padding: 8px 12px;">
                <div style="font-size: 10px; color: #86868b; text-transform: uppercase; font-weight: 600;">Contact & Location</div>
                <div style="font-size: 13px; font-weight: 600; color: #1d1d1f; margin-top: 2px;">+91 8340177620 • Noida, India</div>
              </div>
            </div>

            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <button class="about-action-btn switch-to-projects" style="background: #0071e3; color: white; border: none; padding: 7px 16px; border-radius: 7px; font-size: 12px; font-weight: 500; cursor: pointer;">
                <i class="fa-solid fa-rocket" style="margin-right: 5px;"></i> View Projects
              </button>
              <button class="about-action-btn switch-to-resume" style="background: #f5f5f7; color: #1d1d1f; border: 1px solid #d2d2d7; padding: 7px 14px; border-radius: 7px; font-size: 12px; font-weight: 500; cursor: pointer;">
                <i class="fa-solid fa-file-invoice" style="margin-right: 5px;"></i> Resume
              </button>
              <a href="https://github.com/gmraj11132-tech" target="_blank" style="background: #24292f; color: white; border: none; padding: 7px 14px; border-radius: 7px; font-size: 12px; font-weight: 500; text-decoration: none; display: inline-flex; align-items: center; gap: 5px;">
                <i class="fa-brands fa-github"></i> GitHub Profile
              </a>
              <a href="https://www.linkedin.com/in/aryanrajcse" target="_blank" style="background: #0a66c2; color: white; border: none; padding: 7px 14px; border-radius: 7px; font-size: 12px; font-weight: 500; text-decoration: none; display: inline-flex; align-items: center; gap: 5px;">
                <i class="fa-brands fa-linkedin"></i> LinkedIn Profile
              </a>
              <a href="mailto:aryanjaiswal11132@gmail.com" style="background: #f5f5f7; color: #1d1d1f; border: 1px solid #d2d2d7; padding: 7px 14px; border-radius: 7px; font-size: 12px; font-weight: 500; text-decoration: none; display: inline-flex; align-items: center; gap: 5px;">
                <i class="fa-solid fa-envelope"></i> Email Aryan
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 2: PROJECTS -->
      <div class="about-tab-panel" data-panel="projects" style="display: none;">
        <div style="margin-bottom: 16px;">
          <h3 style="margin: 0 0 4px; font-size: 18px; color: #1d1d1f;">Featured Engineering Projects</h3>
          <p style="margin: 0; font-size: 12px; color: #86868b;">Architected, developed, and deployed by Aryan Raj.</p>
        </div>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px;">
          ${projects.map(p => `
            <div style="background: #ffffff; border: 1px solid #e5e5ea; border-radius: 12px; padding: 14px; display: flex; flex-direction: column; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
              <div style="height: 110px; border-radius: 8px; overflow: hidden; margin-bottom: 10px; background: #f5f5f7; display: flex; align-items: center; justify-content: center; position: relative;">
                <img src="${p.img}" alt="${p.name}" style="width: 100%; height: 100%; object-fit: cover;">
                <span style="position: absolute; top: 6px; right: 6px; background: rgba(0,0,0,0.65); color: #fff; font-size: 10px; padding: 2px 8px; border-radius: 10px; backdrop-filter: blur(4px);">Live System</span>
              </div>
              <div style="font-size: 15px; font-weight: 700; color: #1d1d1f;">${p.name}</div>
              <div style="font-size: 11px; color: #0071e3; font-weight: 500; margin-bottom: 6px;">${p.sub}</div>
              <p style="font-size: 12px; color: #515154; line-height: 1.45; margin: 0 0 10px; flex: 1;">${p.desc}</p>
              <div style="display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 12px;">
                ${p.tags.map(t => `<span style="background: #f5f5f7; color: #515154; font-size: 10px; padding: 2px 7px; border-radius: 4px; border: 1px solid #e5e5ea;">${t}</span>`).join('')}
              </div>
              <div style="display: flex; gap: 8px;">
                ${p.live !== '#' ? `<a href="${p.live}" target="_blank" style="flex: 1; text-align: center; background: #0071e3; color: white; padding: 6px 10px; border-radius: 6px; font-size: 12px; font-weight: 500; text-decoration: none;">Live App ↗</a>` : ''}
                <a href="${p.source}" target="_blank" style="flex: 1; text-align: center; background: #f5f5f7; border: 1px solid #d2d2d7; color: #1d1d1f; padding: 6px 10px; border-radius: 6px; font-size: 12px; font-weight: 500; text-decoration: none;">Source Code ↗</a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- TAB 3: 12 CREDENTIALS -->
      <div class="about-tab-panel" data-panel="credentials" style="display: none;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
          <div>
            <h3 style="margin: 0 0 4px; font-size: 18px; color: #1d1d1f;">12 Verified Industry Credentials</h3>
            <p style="margin: 0; font-size: 12px; color: #86868b;">Click on any credential to view the high-resolution certificate.</p>
          </div>
          <span style="background: rgba(52, 199, 89, 0.15); color: #28a745; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 12px;">12/12 Verified</span>
        </div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
          ${certs.map((c, i) => `
            <div class="cert-card-item" data-img="${c.file}" data-title="${c.title}" style="background: #ffffff; border: 1px solid #e5e5ea; border-radius: 10px; padding: 10px; cursor: pointer; transition: transform 0.15s, box-shadow 0.15s; box-shadow: 0 1px 3px rgba(0,0,0,0.04);" onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 6px 16px rgba(0,0,0,0.08)'" onmouseout="this.style.transform='none';this.style.boxShadow='0 1px 3px rgba(0,0,0,0.04)'">
              <div style="height: 95px; border-radius: 6px; overflow: hidden; background: #f0f0f2; margin-bottom: 8px;">
                <img src="${c.file}" alt="${c.title}" style="width: 100%; height: 100%; object-fit: cover;">
              </div>
              <div style="font-size: 12px; font-weight: 600; color: #1d1d1f; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${c.title}</div>
              <div style="font-size: 11px; color: #86868b; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${c.desc}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- TAB 4: RESUME -->
      <div class="about-tab-panel" data-panel="resume" style="display: none;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
          <div>
            <h3 style="margin: 0 0 4px; font-size: 18px; color: #1d1d1f;">Aryan Raj — Professional Resume</h3>
            <p style="margin: 0; font-size: 12px; color: #86868b;">B.Tech CSE Graduate Trainee & Software Engineer Profile</p>
          </div>
          <div style="display: flex; gap: 8px;">
            <a href="assets/resume_aryan_raj.jpg" download="Aryan_Raj_Resume.jpg" style="background: #0071e3; color: white; padding: 6px 14px; border-radius: 6px; font-size: 12px; font-weight: 500; text-decoration: none; display: inline-flex; align-items: center; gap: 6px;">
              <i class="fa-solid fa-download"></i> Download Resume
            </a>
          </div>
        </div>
        <div style="background: #ffffff; border: 1px solid #e5e5ea; border-radius: 12px; padding: 12px; text-align: center; max-height: 400px; overflow-y: auto;">
          <img src="assets/resume_aryan_raj.jpg" alt="Aryan Raj Resume" style="max-width: 100%; height: auto; border-radius: 6px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        </div>
      </div>

      <!-- TAB 5: SPECS -->
      <div class="about-tab-panel" data-panel="specs" style="display: none;">
        <div style="margin-bottom: 16px;">
          <h3 style="margin: 0 0 4px; font-size: 18px; color: #1d1d1f;">System & Hardware Specifications</h3>
          <p style="margin: 0; font-size: 12px; color: #86868b;">Engineered on Apple Silicon M2 Max architecture.</p>
        </div>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px;">
          <div style="background: #ffffff; border: 1px solid #e5e5ea; border-radius: 12px; padding: 18px;">
            <div style="font-size: 12px; font-weight: 600; color: #0071e3; margin-bottom: 8px;">DISPLAY ENGINE</div>
            <div style="font-size: 18px; font-weight: 700; color: #1d1d1f;">Liquid Retina XDR</div>
            <div style="font-size: 13px; color: #515154; margin-top: 4px;">16.2-inch (3456 × 2234) ProMotion 120Hz</div>
            <div style="font-size: 12px; color: #86868b; margin-top: 10px;">Color Profile: Apple P3 Wide Color</div>
          </div>
          <div style="background: #ffffff; border: 1px solid #e5e5ea; border-radius: 12px; padding: 18px;">
            <div style="font-size: 12px; font-weight: 600; color: #0071e3; margin-bottom: 8px;">STORAGE ARCHITECTURE</div>
            <div style="font-size: 18px; font-weight: 700; color: #1d1d1f;">512 GB Macintosh HD</div>
            <div style="font-size: 13px; color: #515154; margin-top: 4px;">412.8 GB Available of 512 GB (PCIe Gen4 NVMe)</div>
            <div style="height: 6px; background: #e5e5ea; border-radius: 3px; margin-top: 10px; overflow: hidden;">
              <div style="width: 22%; height: 100%; background: #0071e3;"></div>
            </div>
          </div>
          <div style="background: #ffffff; border: 1px solid #e5e5ea; border-radius: 12px; padding: 18px;">
            <div style="font-size: 12px; font-weight: 600; color: #0071e3; margin-bottom: 8px;">NEURAL ENGINE & CHIP</div>
            <div style="font-size: 18px; font-weight: 700; color: #1d1d1f;">Apple M2 Max (12-Core)</div>
            <div style="font-size: 13px; color: #515154; margin-top: 4px;">38-core GPU • 16-core Neural Engine</div>
            <div style="font-size: 12px; color: #86868b; margin-top: 10px;">Unified Memory: 16 GB LPDDR5 (400 GB/s)</div>
          </div>
          <div style="background: #ffffff; border: 1px solid #e5e5ea; border-radius: 12px; padding: 18px;">
            <div style="font-size: 12px; font-weight: 600; color: #0071e3; margin-bottom: 8px;">SOFTWARE ENVIRONMENT</div>
            <div style="font-size: 18px; font-weight: 700; color: #1d1d1f;">macOS Web Sequoia 15.0</div>
            <div style="font-size: 13px; color: #515154; margin-top: 4px;">Darwin Kernel 24.0.0 RELEASE_ARM64</div>
            <div style="font-size: 12px; color: #86868b; margin-top: 10px;">Browser Client: WebKit / V8 Optimized</div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

function initAboutLogic(aid, initialTab = 'overview') {
  const root = document.getElementById(aid);
  if (!root) return;

  const tabBtns = root.querySelectorAll('.about-tab-btn');
  const panels = root.querySelectorAll('.about-tab-panel');

  const switchTab = (tabName) => {
    tabBtns.forEach(b => b.classList.toggle('active', b.dataset.tab === tabName));
    panels.forEach(p => {
      p.style.display = p.dataset.panel === tabName ? 'block' : 'none';
    });
  };

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  root.querySelector('.switch-to-projects')?.addEventListener('click', () => switchTab('projects'));
  root.querySelector('.switch-to-resume')?.addEventListener('click', () => switchTab('resume'));

  // Initial tab switch if requested
  if (initialTab && initialTab !== 'overview') {
    switchTab(initialTab);
  }

  // Certificate Modal Preview
  root.querySelectorAll('.cert-card-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.dataset.img;
      const title = item.dataset.title;
      showCertificateModal(title, img);
    });
  });
}

function showCertificateModal(title, imgSrc) {
  const modal = document.createElement('div');
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.7);backdrop-filter:blur(10px);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;';
  modal.innerHTML = `
    <div style="background:#fff;border-radius:12px;max-width:760px;width:100%;overflow:hidden;box-shadow:0 25px 60px rgba(0,0,0,0.5);display:flex;flex-direction:column;">
      <div style="padding:10px 16px;background:#f5f5f7;border-bottom:1px solid #e5e5ea;display:flex;justify-content:space-between;align-items:center;">
        <span style="font-weight:600;font-size:14px;color:#1d1d1f;">${title}</span>
        <button class="cert-modal-close" style="border:none;background:none;font-size:18px;cursor:pointer;color:#666;padding:0 6px;">✕</button>
      </div>
      <div style="padding:16px;text-align:center;max-height:80vh;overflow-y:auto;background:#fafafa;">
        <img src="${imgSrc}" alt="${title}" style="max-width:100%;height:auto;border-radius:8px;box-shadow:0 4px 20px rgba(0,0,0,0.1);">
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.querySelector('.cert-modal-close').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
}

// --------- GITHUB APP ---------
function generateGitHubContent() {
  const gid = 'github-' + Date.now();
  setTimeout(() => initGitHubLogic(gid), 50);

  return `
  <div id="${gid}" class="social-app-wrapper">
    <div class="social-app-header">
      <div style="display:flex;gap:6px;color:#57606a;">
        <button style="border:none;background:none;cursor:pointer;font-size:14px;">◀</button>
        <button style="border:none;background:none;cursor:pointer;font-size:14px;">▶</button>
        <button style="border:none;background:none;cursor:pointer;font-size:14px;">↻</button>
      </div>
      <div class="social-url-badge">
        <i class="fa-brands fa-github" style="color:#24292f;font-size:14px;"></i>
        <span style="color:#24292f;font-weight:500;">https://github.com/gmraj11132-tech</span>
      </div>
      <div style="display:flex;gap:8px;">
        <a href="https://github.com/gmraj11132-tech" target="_blank" style="background:#24292f;color:#fff;border:none;padding:5px 14px;border-radius:6px;font-size:12px;font-weight:500;text-decoration:none;display:inline-flex;align-items:center;gap:6px;">
          <i class="fa-solid fa-arrow-up-right-from-square"></i> Open on GitHub.com
        </a>
      </div>
    </div>

    <div class="social-app-body" style="background:#f6f8fa;padding:24px;">
      <div style="max-width:800px;margin:0 auto;display:flex;gap:24px;align-items:flex-start;">
        <!-- Left: Profile Sidebar -->
        <div style="width:260px;flex-shrink:0;">
          <div style="position:relative;margin-bottom:12px;">
            <img src="assets/profile.jpg" alt="Aryan Raj" style="width:100%;aspect-ratio:1;border-radius:50%;object-fit:cover;border:1px solid #d0d7de;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
          </div>
          <div style="font-size:22px;font-weight:700;color:#24292f;">Aryan Raj</div>
          <div style="font-size:16px;color:#57606a;margin-bottom:10px;">gmraj11132-tech</div>
          <div style="font-size:13px;line-height:1.5;color:#24292f;margin-bottom:16px;">
            B.Tech CSE Student @ Techno India University | Full Stack & AI Developer | Creator of macOS Web OS
          </div>
          <a href="https://github.com/gmraj11132-tech" target="_blank" style="display:block;text-align:center;width:100%;background:#2da44e;color:#fff;padding:8px 0;border-radius:6px;font-weight:600;font-size:13px;text-decoration:none;margin-bottom:16px;box-sizing:border-box;">
            Follow on GitHub
          </a>
          <div style="font-size:12px;color:#57606a;display:flex;flex-direction:column;gap:8px;">
            <div><i class="fa-solid fa-users" style="width:16px;"></i> <b id="gh-followers" style="color:#24292f;">45</b> followers • <b style="color:#24292f;">28</b> following</div>
            <div><i class="fa-solid fa-building" style="width:16px;"></i> Techno India University</div>
            <div><i class="fa-solid fa-location-dot" style="width:16px;"></i> Noida, Alpha 2, India</div>
            <div><i class="fa-solid fa-envelope" style="width:16px;"></i> aryanjaiswal11132@gmail.com</div>
            <div><i class="fa-solid fa-link" style="width:16px;"></i> <a href="https://gmraj11132-tech.github.io/portfolio" target="_blank" style="color:#0969da;text-decoration:none;">portfolio-website</a></div>
          </div>
        </div>

        <!-- Right: Repositories -->
        <div style="flex:1;">
          <div style="border-bottom:1px solid #d0d7de;padding-bottom:8px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;">
            <div style="font-weight:600;font-size:14px;color:#24292f;"><i class="fa-solid fa-book-bookmark" style="margin-right:6px;"></i> Pinned Repositories</div>
            <span style="font-size:11px;color:#57606a;">Verified Repositories</span>
          </div>

          <div style="display:grid;grid-template-columns:repeat(2, 1fr);gap:12px;margin-bottom:20px;">
            <!-- Repo 1 -->
            <div style="background:#fff;border:1px solid #d0d7de;border-radius:6px;padding:14px;display:flex;flex-direction:column;">
              <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
                <i class="fa-solid fa-book-bookmark" style="color:#57606a;font-size:12px;"></i>
                <a href="https://github.com/gmraj11132-tech/scamshield-ai" target="_blank" style="font-weight:600;font-size:13px;color:#0969da;text-decoration:none;">scamshield-ai</a>
                <span style="border:1px solid #d0d7de;font-size:10px;padding:0 5px;border-radius:10px;color:#57606a;margin-left:auto;">Public</span>
              </div>
              <p style="font-size:11px;color:#57606a;line-height:1.4;margin:0 0 12px;flex:1;">
                Production dual-engine cybersecurity platform detecting fraudulent SMS, spoofed emails, and deceptive screenshots.
              </p>
              <div style="display:flex;align-items:center;gap:12px;font-size:11px;color:#57606a;">
                <span><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#3178c6;margin-right:3px;"></span> TypeScript</span>
                <span><i class="fa-regular fa-star"></i> 28</span>
                <span><i class="fa-solid fa-code-fork"></i> 8</span>
              </div>
            </div>

            <!-- Repo 2 -->
            <div style="background:#fff;border:1px solid #d0d7de;border-radius:6px;padding:14px;display:flex;flex-direction:column;">
              <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
                <i class="fa-solid fa-book-bookmark" style="color:#57606a;font-size:12px;"></i>
                <a href="https://github.com/gmraj11132-tech/careerpilot-ai-resume-analyzer" target="_blank" style="font-weight:600;font-size:13px;color:#0969da;text-decoration:none;">careerpilot-ai</a>
                <span style="border:1px solid #d0d7de;font-size:10px;padding:0 5px;border-radius:10px;color:#57606a;margin-left:auto;">Public</span>
              </div>
              <p style="font-size:11px;color:#57606a;line-height:1.4;margin:0 0 12px;flex:1;">
                AI smart placement suite with 0-100 ATS scoring, JD match, and Gemini-based mock interview preparation.
              </p>
              <div style="display:flex;align-items:center;gap:12px;font-size:11px;color:#57606a;">
                <span><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#3178c6;margin-right:3px;"></span> Next.js</span>
                <span><i class="fa-regular fa-star"></i> 34</span>
                <span><i class="fa-solid fa-code-fork"></i> 11</span>
              </div>
            </div>

            <!-- Repo 3 -->
            <div style="background:#fff;border:1px solid #d0d7de;border-radius:6px;padding:14px;display:flex;flex-direction:column;">
              <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
                <i class="fa-solid fa-book-bookmark" style="color:#57606a;font-size:12px;"></i>
                <a href="https://github.com/gmraj11132-tech/portfolio" target="_blank" style="font-weight:600;font-size:13px;color:#0969da;text-decoration:none;">portfolio</a>
                <span style="border:1px solid #d0d7de;font-size:10px;padding:0 5px;border-radius:10px;color:#57606a;margin-left:auto;">Public</span>
              </div>
              <p style="font-size:11px;color:#57606a;line-height:1.4;margin:0 0 12px;flex:1;">
                MacBook OS crystal glassmorphic developer portfolio with simulated Safari, live terminal, and verified credentials.
              </p>
              <div style="display:flex;align-items:center;gap:12px;font-size:11px;color:#57606a;">
                <span><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#f1e05a;margin-right:3px;"></span> JavaScript</span>
                <span><i class="fa-regular fa-star"></i> 45</span>
                <span><i class="fa-solid fa-code-fork"></i> 12</span>
              </div>
            </div>

            <!-- Repo 4 -->
            <div style="background:#fff;border:1px solid #d0d7de;border-radius:6px;padding:14px;display:flex;flex-direction:column;">
              <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
                <i class="fa-solid fa-book-bookmark" style="color:#57606a;font-size:12px;"></i>
                <a href="https://github.com/gmraj11132-tech/macos-web-os" target="_blank" style="font-weight:600;font-size:13px;color:#0969da;text-decoration:none;">macos-web-os</a>
                <span style="border:1px solid #d0d7de;font-size:10px;padding:0 5px;border-radius:10px;color:#57606a;margin-left:auto;">Public</span>
              </div>
              <p style="font-size:11px;color:#57606a;line-height:1.4;margin:0 0 12px;flex:1;">
                Complete macOS Sequoia web operating system in the browser with authentic window manager and native apps.
              </p>
              <div style="display:flex;align-items:center;gap:12px;font-size:11px;color:#57606a;">
                <span><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#e34c26;margin-right:3px;"></span> HTML5/JS</span>
                <span><i class="fa-regular fa-star"></i> 89</span>
                <span><i class="fa-solid fa-code-fork"></i> 19</span>
              </div>
            </div>
          </div>

          <div style="text-align:center;">
            <a href="https://github.com/gmraj11132-tech?tab=repositories" target="_blank" style="background:#f6f8fa;border:1px solid #d0d7de;color:#0969da;font-weight:600;font-size:12px;padding:7px 18px;border-radius:6px;text-decoration:none;display:inline-block;">
              View All Repositories on GitHub.com ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

function initGitHubLogic(gid) {
  const root = document.getElementById(gid);
  if (!root) return;

  // Asynchronously query public GitHub API
  fetch('https://api.github.com/users/gmraj11132-tech')
    .then(r => r.json())
    .then(data => {
      if (data && data.followers !== undefined) {
        const followersEl = root.querySelector('#gh-followers');
        if (followersEl) followersEl.textContent = data.followers;
      }
    })
    .catch(() => {});
}

// --------- LINKEDIN APP ---------
function generateLinkedInContent() {
  const lid = 'linkedin-' + Date.now();
  setTimeout(() => initLinkedInLogic(lid), 50);

  return `
  <div id="${lid}" class="social-app-wrapper">
    <div class="social-app-header">
      <div style="display:flex;gap:6px;color:#57606a;">
        <button style="border:none;background:none;cursor:pointer;font-size:14px;">◀</button>
        <button style="border:none;background:none;cursor:pointer;font-size:14px;">▶</button>
        <button style="border:none;background:none;cursor:pointer;font-size:14px;">↻</button>
      </div>
      <div class="social-url-badge">
        <i class="fa-brands fa-linkedin" style="color:#0a66c2;font-size:14px;"></i>
        <span style="color:#0a66c2;font-weight:500;">https://www.linkedin.com/in/aryanrajcse</span>
      </div>
      <div style="display:flex;gap:8px;">
        <a href="https://www.linkedin.com/in/aryanrajcse" target="_blank" style="background:#0a66c2;color:#fff;border:none;padding:5px 14px;border-radius:6px;font-size:12px;font-weight:500;text-decoration:none;display:inline-flex;align-items:center;gap:6px;">
          <i class="fa-solid fa-arrow-up-right-from-square"></i> Open on LinkedIn.com
        </a>
      </div>
    </div>

    <div class="social-app-body" style="background:#f3f2ef;padding:20px;">
      <div style="max-width:760px;margin:0 auto;background:#fff;border-radius:10px;border:1px solid #e0dfdc;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.06);margin-bottom:14px;">
        <!-- Banner -->
        <div style="height:140px;background:linear-gradient(135deg, #0077b5, #00a0dc, #004182);position:relative;">
          <div style="position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px);background-size:16px 16px;"></div>
        </div>
        <!-- Profile Info -->
        <div style="padding:0 24px 20px;position:relative;">
          <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:-60px;margin-bottom:12px;">
            <div style="position:relative;">
              <img src="assets/profile.jpg" alt="Aryan Raj" style="width:120px;height:120px;border-radius:50%;object-fit:cover;border:4px solid #fff;box-shadow:0 4px 12px rgba(0,0,0,0.15);">
            </div>
            <div style="display:flex;gap:8px;margin-bottom:6px;">
              <a href="https://www.linkedin.com/in/aryanrajcse" target="_blank" style="background:#0a66c2;color:#fff;border:none;padding:7px 18px;border-radius:20px;font-size:13px;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;gap:6px;">
                <i class="fa-solid fa-user-plus"></i> Connect on LinkedIn
              </a>
              <a href="mailto:aryanjaiswal11132@gmail.com" style="border:1.5px solid #0a66c2;color:#0a66c2;background:none;padding:6px 16px;border-radius:20px;font-size:13px;font-weight:600;text-decoration:none;">
                Message
              </a>
            </div>
          </div>

          <div style="display:flex;align-items:center;gap:6px;">
            <h2 style="margin:0;font-size:22px;color:#181818;">Aryan Raj</h2>
            <i class="fa-solid fa-circle-check" style="color:#0a66c2;font-size:16px;" title="Verified Profile"></i>
          </div>
          <div style="font-size:14px;color:#181818;margin:4px 0 6px;line-height:1.4;">
            <b>B.Tech CSE Student (4th Year, 8.0 CGPA)</b> | Full Stack & AI Developer | Software Engineering Enthusiast
          </div>
          <div style="font-size:12px;color:#666666;margin-bottom:10px;">
            Noida, Uttar Pradesh, India • <a href="mailto:aryanjaiswal11132@gmail.com" style="color:#0a66c2;font-weight:600;text-decoration:none;">Contact info</a>
          </div>
          <div style="font-size:12px;color:#0a66c2;font-weight:600;">
            500+ connections
          </div>
        </div>
      </div>

      <!-- About Section Card -->
      <div style="max-width:760px;margin:0 auto;background:#fff;border-radius:10px;border:1px solid #e0dfdc;padding:20px;box-shadow:0 1px 4px rgba(0,0,0,0.06);margin-bottom:14px;">
        <h3 style="margin:0 0 10px;font-size:16px;color:#181818;">About</h3>
        <p style="font-size:13px;line-height:1.6;color:#333;margin:0 0 8px;">
          Passionate and results-driven Computer Science Engineering student at <b>Techno India University (8.0 CGPA)</b> with demonstrated experience in Full Stack Development, Artificial Intelligence integrations, and system design.
        </p>
        <p style="font-size:13px;line-height:1.6;color:#333;margin:0;">
          Creator of <b>ScamShield AI</b> (dual-engine cyber threat detection platform) and <b>CareerPilot AI</b> (automated resume ATS scoring & smart placement suite). Adept with Next.js, React, TypeScript, Python, Node.js, and Java.
        </p>
      </div>

      <!-- Experience & Education Card -->
      <div style="max-width:760px;margin:0 auto;background:#fff;border-radius:10px;border:1px solid #e0dfdc;padding:20px;box-shadow:0 1px 4px rgba(0,0,0,0.06);">
        <h3 style="margin:0 0 14px;font-size:16px;color:#181818;">Education & Credentials</h3>
        <div style="display:flex;gap:12px;margin-bottom:14px;">
          <div style="width:44px;height:44px;border-radius:6px;background:#f3f2ef;display:flex;align-items:center;justify-content:center;color:#0a66c2;font-size:22px;flex-shrink:0;">
            <i class="fa-solid fa-graduation-cap"></i>
          </div>
          <div>
            <div style="font-weight:600;font-size:14px;color:#181818;">Techno India University</div>
            <div style="font-size:12px;color:#444;">Bachelor of Technology - BTech, Computer Science & Engineering</div>
            <div style="font-size:11px;color:#666;">2022 - 2026 • Grade: 8.0 CGPA</div>
          </div>
        </div>
        <div style="display:flex;gap:12px;">
          <div style="width:44px;height:44px;border-radius:6px;background:#f3f2ef;display:flex;align-items:center;justify-content:center;color:#0a66c2;font-size:22px;flex-shrink:0;">
            <i class="fa-solid fa-certificate"></i>
          </div>
          <div>
            <div style="font-weight:600;font-size:14px;color:#181818;">12 Verified Industry Certifications</div>
            <div style="font-size:12px;color:#444;">IIT BHU Varanasi, IBM Python, Siemens, Tata Forage, Prodigy, InternPe</div>
            <div style="font-size:11px;color:#666;">Issued by accredited institutions & industry partners</div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

function initLinkedInLogic(lid) {
  // Logic ready
}


// ============================================================
// SPOTLIGHT
// ============================================================
function initSpotlight() {
  const overlay = document.getElementById('spotlight-search');
  const input = document.getElementById('spotlight-input');
  const results = document.getElementById('spotlight-results');
  if (!overlay || !input) return;

  const toggle = () => {
    overlay.classList.toggle('hidden');
    if (!overlay.classList.contains('hidden')) {
      input.value = '';
      input.focus();
      if (results) results.classList.add('hidden');
    }
  };

  window.osEvents.on('toggle-spotlight', toggle);
  overlay.addEventListener('click', e => { if (e.target === overlay) toggle(); });

  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    if (!q) { if (results) results.classList.add('hidden'); return; }
    if (results) {
      results.classList.remove('hidden');
      const matches = Object.entries(appRegistry).filter(([id, v]) => {
        const n = v.name.toLowerCase();
        return n.includes(q) || id.includes(q) ||
               (id === 'about' && (q.includes('aryan') || q.includes('bio') || q.includes('resume') || q.includes('portfolio') || q.includes('mac') || q.includes('creator') || q.includes('cert'))) ||
               (id === 'github' && (q.includes('git') || q.includes('repo') || q.includes('code') || q.includes('project'))) ||
               (id === 'linkedin' && (q.includes('link') || q.includes('job') || q.includes('career') || q.includes('connect')));
      });
      results.innerHTML = matches.length ?
        `<div style="padding:6px 12px;font-size:11px;font-weight:600;color:#888">Applications</div>` +
        matches.map(([id, app]) => `<div class="spotlight-result" style="padding:8px 12px;cursor:pointer;display:flex;align-items:center;gap:10px;border-radius:6px" onmouseover="this.style.background='#007AFF';this.style.color='#fff'" onmouseout="this.style.background='';this.style.color=''" onclick="window.openApp('${id}');document.getElementById('spotlight-search').classList.add('hidden')">
          <i class="fa-solid ${app.icon}" style="font-size:18px"></i><span style="font-size:14px">${app.name}</span>
        </div>`).join('') :
        `<div style="padding:16px;text-align:center;color:#888;font-size:13px">No results</div>`;
    }
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Escape') toggle();
    if (e.key === 'Enter') {
      const first = results?.querySelector('.spotlight-result');
      if (first) first.click();
    }
  });
}

// ============================================================
// CONTROL CENTER
// ============================================================
function initControlCenter() {
  const panel = document.getElementById('control-center');
  if (!panel) return;

  window.osEvents.on('toggle-control-center', () => panel.classList.toggle('hidden'));
  document.addEventListener('click', e => {
    if (!panel.contains(e.target) && !e.target.closest('#control-center-btn')) {
      panel.classList.add('hidden');
    }
  });

  // Toggle buttons
  panel.querySelectorAll('.cc-icon').forEach(icon => {
    icon.addEventListener('click', () => icon.classList.toggle('active'));
  });
}

// ============================================================
// LAUNCHPAD
// ============================================================
function initLaunchpad() {
  const overlay = document.getElementById('launchpad');
  const grid = document.getElementById('launchpad-grid');
  if (!overlay || !grid) return;

  // Populate grid
  grid.innerHTML = Object.entries(appRegistry).map(([id, app]) =>
    `<div class="launchpad-item" style="display:flex;flex-direction:column;align-items:center;cursor:pointer;padding:10px" onclick="window.openApp('${id}');document.getElementById('launchpad').classList.add('hidden')">
      <div style="width:64px;height:64px;border-radius:14px;background:${app.color};display:flex;align-items:center;justify-content:center;color:#fff;font-size:28px;box-shadow:0 4px 12px rgba(0,0,0,0.2)"><i class="fa-solid ${app.icon}"></i></div>
      <span style="font-size:12px;color:#fff;margin-top:6px;text-shadow:0 1px 3px rgba(0,0,0,0.5)">${app.name}</span>
    </div>`
  ).join('');

  window.osEvents.on('toggle-launchpad', () => overlay.classList.toggle('hidden'));
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.add('hidden');
  });

  // Search
  const searchInput = overlay.querySelector('input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase();
      overlay.querySelectorAll('.launchpad-item').forEach(item => {
        const name = item.querySelector('span').textContent.toLowerCase();
        item.style.display = name.includes(q) ? '' : 'none';
      });
    });
  }
}

// ============================================================
// CONTEXT MENU
// ============================================================
function initContextMenu() {
  const menu = document.getElementById('context-menu');
  if (!menu) return;

  document.addEventListener('contextmenu', e => {
    e.preventDefault();
    menu.classList.remove('hidden');
    menu.style.left = Math.min(e.clientX, window.innerWidth - 200) + 'px';
    menu.style.top = Math.min(e.clientY, window.innerHeight - 300) + 'px';
  });

  document.addEventListener('click', () => menu.classList.add('hidden'));
}

// ============================================================
// NOTIFICATIONS
// ============================================================
function initNotifications() {
  // Show welcome notification after a short delay
  setTimeout(() => {
    showNotification('macOS Web', 'Welcome! Your Mac is ready to use.', 'fa-apple-whole');
  }, 2000);
}

function showNotification(title, body, icon = 'fa-bell') {
  const notif = document.createElement('div');
  notif.style.cssText = 'position:fixed;top:35px;right:12px;width:320px;background:rgba(255,255,255,0.92);backdrop-filter:blur(20px);border-radius:12px;padding:12px 16px;box-shadow:0 8px 30px rgba(0,0,0,0.15);z-index:99999;display:flex;gap:10px;align-items:center;transform:translateX(340px);transition:transform 0.4s cubic-bezier(0.16,1,0.3,1);cursor:pointer;border:1px solid rgba(0,0,0,0.08)';
  notif.innerHTML = `<div style="width:36px;height:36px;border-radius:8px;background:#007AFF;display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0"><i class="fa-solid ${icon}"></i></div><div><div style="font-weight:600;font-size:13px;color:#333">${title}</div><div style="font-size:12px;color:#666;margin-top:2px">${body}</div></div>`;
  document.body.appendChild(notif);
  requestAnimationFrame(() => { notif.style.transform = 'translateX(0)'; });
  setTimeout(() => {
    notif.style.transform = 'translateX(340px)';
    setTimeout(() => notif.remove(), 400);
  }, 4000);
  notif.addEventListener('click', () => {
    notif.style.transform = 'translateX(340px)';
    setTimeout(() => notif.remove(), 400);
  });
}

// ============================================================
// LOCK SCREEN
// ============================================================
function initLockScreen() {
  const lockScreen = document.getElementById('lock-screen');
  if (!lockScreen) return;

  const pwInput = document.getElementById('unlock-password');
  const unlockBtn = document.getElementById('unlock-btn');

  const doUnlock = () => {
    lockScreen.style.transition = 'opacity 0.5s ease';
    lockScreen.style.opacity = '0';
    setTimeout(() => {
      lockScreen.classList.add('hidden');
      lockScreen.style.opacity = '1';
    }, 500);
  };

  if (pwInput) pwInput.addEventListener('keydown', e => { if (e.key === 'Enter') doUnlock(); });
  if (unlockBtn) unlockBtn.addEventListener('click', doUnlock);

  // Update lock screen clock
  const updateLockClock = () => {
    const now = new Date();
    const timeEl = lockScreen.querySelector('.lock-time');
    const dateEl = lockScreen.querySelector('.lock-date');
    if (timeEl) timeEl.textContent = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    if (dateEl) dateEl.textContent = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };
  setInterval(updateLockClock, 1000);
  updateLockClock();
}

function showLockScreen() {
  const lockScreen = document.getElementById('lock-screen');
  if (lockScreen) {
    lockScreen.classList.remove('hidden');
    lockScreen.style.opacity = '1';
    const pw = document.getElementById('unlock-password');
    if (pw) { pw.value = ''; pw.focus(); }
  }
}

// ============================================================
// SETTINGS & SHORTCUTS
// ============================================================
function loadSettings() {
  const saved = localStorage.getItem('macOS_settings');
  if (saved) {
    try { window.macOS.settings = { ...window.macOS.settings, ...JSON.parse(saved) }; }
    catch (e) { console.error('Settings load error', e); }
  }
}

function saveSettings() {
  localStorage.setItem('macOS_settings', JSON.stringify(window.macOS.settings));
}

function setupKeyboardShortcuts() {
  document.addEventListener('keydown', e => {
    const mod = e.metaKey || e.ctrlKey;
    if (mod && e.key === ' ') { e.preventDefault(); window.osEvents.emit('toggle-spotlight'); }
    else if (mod && e.key === 'w') { e.preventDefault(); window.osEvents.emit('close-active-window'); }
    else if (mod && e.key === 'm') { e.preventDefault(); window.osEvents.emit('minimize-active-window'); }
    else if (e.key === 'Escape') {
      document.getElementById('spotlight-search')?.classList.add('hidden');
      document.getElementById('launchpad')?.classList.add('hidden');
    }
  });
}

function setupAutoSave() {
  window.addEventListener('beforeunload', saveSettings);
  setInterval(saveSettings, 30000);
}

// ============================================================
// START
// ============================================================
window.addEventListener('DOMContentLoaded', () => {
  startBoot();
});
