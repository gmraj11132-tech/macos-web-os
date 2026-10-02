export function showContextMenu(x, y, items) {
  let menu = document.getElementById('os-context-menu');
  if (!menu) {
    menu = document.createElement('div');
    menu.id = 'os-context-menu';
    menu.style.position = 'fixed';
    menu.style.backgroundColor = 'rgba(255,255,255,0.9)';
    menu.style.backdropFilter = 'blur(15px)';
    menu.style.border = '1px solid rgba(0,0,0,0.1)';
    menu.style.borderRadius = '8px';
    menu.style.padding = '5px 0';
    menu.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
    menu.style.zIndex = '10002';
    document.body.appendChild(menu);
  }

  menu.innerHTML = '';
  items.forEach(item => {
    if (item === 'separator') {
      const sep = document.createElement('div');
      sep.style.height = '1px';
      sep.style.backgroundColor = 'rgba(0,0,0,0.1)';
      sep.style.margin = '5px 0';
      menu.appendChild(sep);
    } else {
      const el = document.createElement('div');
      el.textContent = item.label;
      el.style.padding = '5px 20px';
      el.style.fontSize = '14px';
      el.style.cursor = 'default';
      el.addEventListener('mouseenter', () => el.style.backgroundColor = '#007AFF');
      el.addEventListener('mouseleave', () => el.style.backgroundColor = 'transparent');
      el.addEventListener('click', () => {
        if (item.action) item.action();
        menu.style.display = 'none';
      });
      menu.appendChild(el);
    }
  });

  menu.style.left = `${x}px`;
  menu.style.top = `${y}px`;
  menu.style.display = 'block';
}

export default function initContextMenu() {
  window.osEvents = window.osEvents || {
    listeners: {},
    on(e, f) { (this.listeners[e] = this.listeners[e] || []).push(f); },
    emit(e, ...a) { (this.listeners[e] || []).forEach(f => f(...a)); }
  };

  window.osEvents.on('context-menu', (data) => {
    let items = [];
    if (data.context === 'desktop') {
      items = [
        { label: 'New Folder', action: () => console.log('New Folder') },
        'separator',
        { label: 'Get Info', action: () => console.log('Info') },
        { label: 'Change Desktop Background', action: () => console.log('BG') }
      ];
    } else if (data.context === 'dock') {
      items = [
        { label: 'Options', action: () => console.log('Options') },
        { label: 'Quit', action: () => console.log('Quit') }
      ];
    }
    showContextMenu(data.x, data.y, items);
  });

  document.addEventListener('click', () => {
    const menu = document.getElementById('os-context-menu');
    if (menu) menu.style.display = 'none';
  });
}
