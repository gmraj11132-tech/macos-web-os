export function updateActiveApp(appName) {
  const activeAppEl = document.getElementById('active-app-name');
  if (activeAppEl) activeAppEl.textContent = appName;
}

export default function initMenuBar() {
  window.osEvents = window.osEvents || {
    listeners: {},
    on(e, f) { (this.listeners[e] = this.listeners[e] || []).push(f); },
    emit(e, ...a) { (this.listeners[e] || []).forEach(f => f(...a)); }
  };

  const clockEl = document.getElementById('menubar-clock');
  const updateClock = () => {
    const now = new Date();
    if (clockEl) {
      clockEl.textContent = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) + '  ' + 
                            now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
  };
  setInterval(updateClock, 1000);
  updateClock();

  // Dropdown system
  const menuItems = document.querySelectorAll('.menubar-item');
  let openMenu = null;

  menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const dropdown = item.querySelector('.dropdown-menu');
      if (dropdown) {
        if (openMenu && openMenu !== dropdown) {
          openMenu.style.display = 'none';
        }
        const isVisible = dropdown.style.display === 'block';
        dropdown.style.display = isVisible ? 'none' : 'block';
        openMenu = isVisible ? null : dropdown;
      }
    });
  });

  document.addEventListener('click', () => {
    if (openMenu) {
      openMenu.style.display = 'none';
      openMenu = null;
    }
  });

  // Icons clicks
  document.getElementById('menubar-wifi')?.addEventListener('click', () => window.osEvents.emit('toggle-control-center'));
  document.getElementById('menubar-spotlight')?.addEventListener('click', () => window.osEvents.emit('toggle-spotlight'));
  document.getElementById('menubar-control-center')?.addEventListener('click', () => window.osEvents.emit('toggle-control-center'));
  
  window.osEvents.on('login-complete', () => {
    const menubar = document.getElementById('menubar');
    if(menubar) menubar.style.display = 'flex';
  });
}
