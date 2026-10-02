export function initSafari() {
    window.macOS = window.macOS || { apps: {} };
    window.macOS.apps.safari = { init: initSafari, open: openSafari };
}

export function openSafari(url = 'https://www.google.com/webhp?igu=1') {
    const content = `
        <div style="display:flex; flex-direction:column; height:100%; font-family: -apple-system, sans-serif;">
            <div style="display:flex; align-items:center; padding: 8px; background: #f0f0f0; border-bottom: 1px solid #ccc; gap: 10px;">
                <div style="display:flex; gap: 5px;">
                    <button id="safari-back">◀</button>
                    <button id="safari-fwd">▶</button>
                    <button id="safari-reload">↻</button>
                </div>
                <input type="text" id="safari-url" value="${url}" style="flex:1; padding: 5px 10px; border-radius: 6px; border: 1px solid #ccc; text-align:center;" />
                <button id="safari-newtab">+</button>
            </div>
            <div style="display:flex; background:#e0e0e0; padding: 4px 8px; gap: 15px; font-size: 12px; border-bottom: 1px solid #ccc;">
                <span cursor="pointer">Google</span>
                <span cursor="pointer">YouTube</span>
                <span cursor="pointer">Wikipedia</span>
                <span cursor="pointer">GitHub</span>
            </div>
            <div style="flex: 1; background: #fff;">
                <iframe id="safari-frame" src="${url}" style="width: 100%; height: 100%; border: none;" sandbox="allow-scripts allow-same-origin allow-forms"></iframe>
            </div>
        </div>
    `;

    if (window.macOS.windowManager) {
        const win = window.macOS.windowManager.createWindow({
            id: 'safari',
            title: 'Safari',
            width: 800,
            height: 600,
            content: content
        });
        
        setTimeout(() => {
            const doc = document.getElementById(win.id);
            if(doc) {
                const input = doc.querySelector('#safari-url');
                const iframe = doc.querySelector('#safari-frame');
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        let val = input.value;
                        if (!val.startsWith('http')) val = 'https://' + val;
                        iframe.src = val;
                    }
                });
            }
        }, 100);
    }
}
