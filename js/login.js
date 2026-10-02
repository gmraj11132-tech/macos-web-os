export default function initLogin() {
  window.osEvents = window.osEvents || {
    listeners: {},
    on(e, f) { (this.listeners[e] = this.listeners[e] || []).push(f); },
    emit(e, ...a) { (this.listeners[e] || []).forEach(f => f(...a)); }
  };
  window.macOS = window.macOS || {};

  const loginScreen = document.getElementById('login-screen');
  const passwordInput = document.getElementById('password-input');
  
  if (!loginScreen) return;

  window.osEvents.on('boot-complete', () => {
    loginScreen.style.display = 'flex';
    loginScreen.style.opacity = '1';
    if(passwordInput) passwordInput.focus();
  });

  const updateLoginTime = () => {
    const timeEl = document.getElementById('login-time');
    const dateEl = document.getElementById('login-date');
    const now = new Date();
    if(timeEl) timeEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if(dateEl) dateEl.textContent = now.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
  };
  
  setInterval(updateLoginTime, 1000);
  updateLoginTime();

  if (passwordInput) {
    passwordInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const password = passwordInput.value;
        if (password === '') {
          loginScreen.style.transition = 'opacity 0.5s';
          loginScreen.style.opacity = '0';
          setTimeout(() => {
            loginScreen.style.display = 'none';
            window.osEvents.emit('login-complete');
          }, 500);
        } else {
          passwordInput.classList.add('shake');
          setTimeout(() => passwordInput.classList.remove('shake'), 400);
          passwordInput.value = '';
        }
      }
    });
  }
}
