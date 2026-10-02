export function addRunningIndicator(appId) {
  const icon = document.querySelector(`.dock-item[data-appid="${appId}"]`);
  if (icon && !icon.querySelector('.running-dot')) {
    const dot = document.createElement('div');
    dot.className = 'running-dot';
    icon.appendChild(dot);
  }
}

export function removeRunningIndicator(appId) {
  const icon = document.querySelector(`.dock-item[data-appid="${appId}"]`);
  if (icon) {
    const dot = icon.querySelector('.running-dot');
    if (dot) dot.remove();
  }
}

export function bounceDockIcon(appId) {
  const icon = document.querySelector(`.dock-item[data-appid="${appId}"]`);
  if (icon) {
    icon.classList.add('bounce');
    setTimeout(() => icon.classList.remove('bounce'), 2000);
  }
}

export default function initDock() {
  window.osEvents = window.osEvents || {
    listeners: {},
    on(e, f) { (this.listeners[e] = this.listeners[e] || []).push(f); },
    emit(e, ...a) { (this.listeners[e] || []).forEach(f => f(...a)); }
  };

  const dock = document.getElementById('dock');
  if (!dock) return;

  window.osEvents.on('login-complete', () => {
    dock.style.display = 'flex';
  });

  const dockItems = dock.querySelectorAll('.dock-item');
  
  dock.addEventListener('mousemove', (e) => {
    dockItems.forEach(item => {
      const rect = item.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const distance = Math.abs(e.clientX - center);
      const scale = 1 + Math.max(0, 1 - distance / 150) * 0.5;
      item.style.transform = `scale(${scale})`;
    });
  });

  dock.addEventListener('mouseleave', () => {
    dockItems.forEach(item => {
      item.style.transform = 'scale(1)';
    });
  });

  dockItems.forEach(item => {
    item.addEventListener('click', () => {
      const appId = item.dataset.appid;
      if (appId) {
        bounceDockIcon(appId);
        window.osEvents.emit('launch-app', appId);
        addRunningIndicator(appId);
      }
    });

    item.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      window.osEvents.emit('context-menu', {
        x: e.clientX,
        y: e.clientY,
        context: 'dock',
        appId: item.dataset.appid
      });
    });
  });
}
