export function showNotification(title, body, icon = '') {
  const toast = document.createElement('div');
  toast.className = 'notification-toast';
  toast.style.position = 'fixed';
  toast.style.top = '40px';
  toast.style.right = '20px';
  toast.style.width = '300px';
  toast.style.backgroundColor = 'rgba(255,255,255,0.9)';
  toast.style.backdropFilter = 'blur(10px)';
  toast.style.padding = '15px';
  toast.style.borderRadius = '12px';
  toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
  toast.style.zIndex = '10001';
  toast.style.transition = 'transform 0.3s, opacity 0.3s';
  toast.style.transform = 'translateX(120%)';

  toast.innerHTML = `
    <div style="font-weight:bold; margin-bottom:5px;">${title}</div>
    <div style="font-size:13px; color:#555;">${body}</div>
  `;

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.transform = 'translateX(0)';
  });

  setTimeout(() => {
    toast.style.transform = 'translateX(120%)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

export default function initNotifications() {
  window.osEvents = window.osEvents || {
    listeners: {},
    on(e, f) { (this.listeners[e] = this.listeners[e] || []).push(f); },
    emit(e, ...a) { (this.listeners[e] || []).forEach(f => f(...a)); }
  };

  // Setup notification center sidebar if needed
  window.osEvents.on('show-notification', ({title, body, icon}) => {
    showNotification(title, body, icon);
  });
}
