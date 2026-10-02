export default function initDesktop() {
  window.osEvents = window.osEvents || {
    listeners: {},
    on(e, f) { (this.listeners[e] = this.listeners[e] || []).push(f); },
    emit(e, ...a) { (this.listeners[e] || []).forEach(f => f(...a)); }
  };

  const desktop = document.getElementById('desktop');
  if (!desktop) return;

  window.osEvents.on('login-complete', () => {
    desktop.style.display = 'block';
  });

  desktop.addEventListener('click', (e) => {
    if (e.target === desktop) {
      window.osEvents.emit('desktop-click');
    }
  });

  desktop.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    if (e.target === desktop) {
      window.osEvents.emit('context-menu', {
        x: e.clientX,
        y: e.clientY,
        context: 'desktop'
      });
    }
  });

  let isDragging = false;
  let startX, startY;
  const selectionBox = document.createElement('div');
  selectionBox.className = 'selection-box';
  selectionBox.style.display = 'none';
  selectionBox.style.position = 'absolute';
  selectionBox.style.border = '1px solid rgba(255, 255, 255, 0.5)';
  selectionBox.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
  selectionBox.style.zIndex = '9000';
  desktop.appendChild(selectionBox);

  desktop.addEventListener('mousedown', (e) => {
    if (e.target === desktop && e.button === 0) {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      selectionBox.style.left = `${startX}px`;
      selectionBox.style.top = `${startY}px`;
      selectionBox.style.width = '0px';
      selectionBox.style.height = '0px';
      selectionBox.style.display = 'block';
    }
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    const currentY = e.clientY;
    selectionBox.style.left = `${Math.min(startX, currentX)}px`;
    selectionBox.style.top = `${Math.min(startY, currentY)}px`;
    selectionBox.style.width = `${Math.abs(currentX - startX)}px`;
    selectionBox.style.height = `${Math.abs(currentY - startY)}px`;
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    selectionBox.style.display = 'none';
  });
}
