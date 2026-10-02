export default function initBoot() {
  window.osEvents = window.osEvents || {
    listeners: {},
    on(e, f) { (this.listeners[e] = this.listeners[e] || []).push(f); },
    emit(e, ...a) { (this.listeners[e] || []).forEach(f => f(...a)); }
  };
  window.macOS = window.macOS || {};

  const bootScreen = document.getElementById('boot-screen');
  if (!bootScreen) return;

  const progressBar = bootScreen.querySelector('.progress-bar');
  if (progressBar) {
    progressBar.style.width = '0%';
    setTimeout(() => {
      progressBar.style.transition = 'width 3s ease-in-out';
      progressBar.style.width = '100%';
    }, 100);
  }

  setTimeout(() => {
    bootScreen.style.transition = 'opacity 0.5s';
    bootScreen.style.opacity = '0';
    setTimeout(() => {
      bootScreen.style.display = 'none';
      window.osEvents.emit('boot-complete');
    }, 500);
  }, 3200);
}
