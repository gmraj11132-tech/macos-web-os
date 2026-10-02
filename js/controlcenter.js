export default function initControlCenter() {
  window.osEvents = window.osEvents || {
    listeners: {},
    on(e, f) { (this.listeners[e] = this.listeners[e] || []).push(f); },
    emit(e, ...a) { (this.listeners[e] || []).forEach(f => f(...a)); }
  };

  const cc = document.createElement('div');
  cc.id = 'control-center';
  cc.style.display = 'none';
  cc.style.position = 'fixed';
  cc.style.top = '35px';
  cc.style.right = '10px';
  cc.style.width = '320px';
  cc.style.backgroundColor = 'rgba(255,255,255,0.85)';
  cc.style.backdropFilter = 'blur(20px)';
  cc.style.borderRadius = '16px';
  cc.style.padding = '15px';
  cc.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
  cc.style.zIndex = '9999';

  cc.innerHTML = `
    <div style="display:flex; gap:10px; margin-bottom:10px;">
      <div style="flex:1; background:rgba(0,0,0,0.05); padding:10px; border-radius:10px;">
        <div><b>Wi-Fi</b></div>
        <div style="font-size:12px; color:#555;">Home Network</div>
      </div>
      <div style="flex:1; background:rgba(0,0,0,0.05); padding:10px; border-radius:10px;">
        <div><b>Bluetooth</b></div>
        <div style="font-size:12px; color:#555;">On</div>
      </div>
    </div>
    <div style="background:rgba(0,0,0,0.05); padding:10px; border-radius:10px; margin-bottom:10px;">
      <div style="margin-bottom:5px;"><b>Display</b></div>
      <input type="range" min="0" max="100" value="80" style="width:100%;">
    </div>
    <div style="background:rgba(0,0,0,0.05); padding:10px; border-radius:10px;">
      <div style="margin-bottom:5px;"><b>Sound</b></div>
      <input type="range" min="0" max="100" value="50" style="width:100%;">
    </div>
  `;

  document.body.appendChild(cc);

  window.osEvents.on('toggle-control-center', () => {
    cc.style.display = cc.style.display === 'none' ? 'block' : 'none';
  });

  document.addEventListener('click', (e) => {
    if (cc.style.display === 'block' && !cc.contains(e.target) && !e.target.closest('#menubar-control-center')) {
      cc.style.display = 'none';
    }
  });
}
