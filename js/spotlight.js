export default function initSpotlight() {
  window.osEvents = window.osEvents || {
    listeners: {},
    on(e, f) { (this.listeners[e] = this.listeners[e] || []).push(f); },
    emit(e, ...a) { (this.listeners[e] || []).forEach(f => f(...a)); }
  };

  const spotlight = document.createElement('div');
  spotlight.id = 'spotlight-container';
  spotlight.style.display = 'none';
  spotlight.style.position = 'fixed';
  spotlight.style.top = '20%';
  spotlight.style.left = '50%';
  spotlight.style.transform = 'translate(-50%, 0)';
  spotlight.style.width = '600px';
  spotlight.style.backgroundColor = 'rgba(255,255,255,0.85)';
  spotlight.style.backdropFilter = 'blur(20px)';
  spotlight.style.borderRadius = '10px';
  spotlight.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
  spotlight.style.zIndex = '10000';
  
  spotlight.innerHTML = `
    <div style="display:flex; align-items:center; padding:15px; border-bottom:1px solid #ddd;">
      <span style="margin-right:10px; font-size:20px;">🔍</span>
      <input type="text" id="spotlight-input" placeholder="Spotlight Search" style="width:100%; font-size:24px; border:none; background:transparent; outline:none;">
    </div>
    <div id="spotlight-results" style="max-height:400px; overflow-y:auto; padding:10px;"></div>
  `;

  document.body.appendChild(spotlight);
  const input = document.getElementById('spotlight-input');

  const toggleSpotlight = () => {
    if (spotlight.style.display === 'none') {
      spotlight.style.display = 'block';
      input.value = '';
      input.focus();
    } else {
      spotlight.style.display = 'none';
    }
  };

  window.osEvents.on('toggle-spotlight', toggleSpotlight);

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === ' ') {
      e.preventDefault();
      toggleSpotlight();
    }
    if (e.key === 'Escape' && spotlight.style.display === 'block') {
      spotlight.style.display = 'none';
    }
  });

  document.addEventListener('click', (e) => {
    if (spotlight.style.display === 'block' && !spotlight.contains(e.target)) {
      spotlight.style.display = 'none';
    }
  });
}
