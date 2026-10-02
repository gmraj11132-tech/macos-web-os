export default function initLaunchpad() {
  window.osEvents = window.osEvents || {
    listeners: {},
    on(e, f) { (this.listeners[e] = this.listeners[e] || []).push(f); },
    emit(e, ...a) { (this.listeners[e] || []).forEach(f => f(...a)); }
  };

  const launchpad = document.createElement('div');
  launchpad.id = 'launchpad';
  launchpad.style.display = 'none';
  launchpad.style.position = 'fixed';
  launchpad.style.top = '0';
  launchpad.style.left = '0';
  launchpad.style.width = '100vw';
  launchpad.style.height = '100vh';
  launchpad.style.backgroundColor = 'rgba(0,0,0,0.2)';
  launchpad.style.backdropFilter = 'blur(20px)';
  launchpad.style.zIndex = '9998';
  launchpad.style.opacity = '0';
  launchpad.style.transition = 'opacity 0.3s, transform 0.3s';
  launchpad.style.transform = 'scale(1.1)';

  launchpad.innerHTML = `
    <div style="padding: 50px; text-align: center;">
      <input type="text" placeholder="Search" style="width:300px; padding:10px; border-radius:20px; border:none; background:rgba(255,255,255,0.3); color:#fff; font-size:16px; outline:none; text-align:center; margin-bottom:50px;">
      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(100px, 1fr)); gap:40px; max-width:800px; margin:0 auto;">
        <!-- Apps go here -->
      </div>
    </div>
  `;

  document.body.appendChild(launchpad);

  window.osEvents.on('launch-app', (appId) => {
    if (appId === 'launchpad') {
      launchpad.style.display = 'block';
      setTimeout(() => {
        launchpad.style.opacity = '1';
        launchpad.style.transform = 'scale(1)';
      }, 10);
    }
  });

  launchpad.addEventListener('click', (e) => {
    if (e.target === launchpad) {
      launchpad.style.opacity = '0';
      launchpad.style.transform = 'scale(1.1)';
      setTimeout(() => {
        launchpad.style.display = 'none';
      }, 300);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && launchpad.style.display === 'block') {
      launchpad.style.opacity = '0';
      launchpad.style.transform = 'scale(1.1)';
      setTimeout(() => launchpad.style.display = 'none', 300);
    }
  });
}
