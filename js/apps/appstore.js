export function initAppStore() {
    window.macOS = window.macOS || { apps: {} };
    window.macOS.apps.appstore = { init: initAppStore, open: openAppStore };
}

export function openAppStore() {
    const apps = [
        {name: 'Code Editor', cat: 'Developer Tools', color: '#1e1e1e'},
        {name: 'To-Do List', cat: 'Productivity', color: '#ff9500'},
        {name: 'Chess', cat: 'Games', color: '#8b4513'},
        {name: 'Unit Converter', cat: 'Utilities', color: '#34c759'}
    ];

    let appCards = '';
    apps.forEach(a => {
        appCards += \`<div style="display:flex; gap: 15px; padding: 15px; border-bottom: 1px solid #eee; align-items:center;">
            <div style="width: 64px; height: 64px; background: \${a.color}; border-radius: 16px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);"></div>
            <div style="flex:1;">
                <div style="font-weight:600; font-size:15px;">\${a.name}</div>
                <div style="color:#666; font-size:13px;">\${a.cat}</div>
                <div style="color:#ff9500; font-size:11px; margin-top:2px;">★★★★☆</div>
            </div>
            <button style="padding: 5px 15px; background: #f0f0f0; border:none; border-radius:15px; font-weight:600; color:#007aff; cursor:pointer;">GET</button>
        </div>\`;
    });

    const content = `
        <div style="display:flex; height:100%; font-family: -apple-system, sans-serif; background:#fff;">
            <div style="width: 200px; border-right: 1px solid #ddd; background: #f9f9f9; padding: 15px 10px;">
                <input type="text" placeholder="Search" style="width:100%; box-sizing:border-box; padding: 6px 10px; border-radius:6px; border:1px solid #ccc; margin-bottom: 20px;">
                <div style="padding:8px 10px; color:#007aff; font-size:15px; font-weight:600;">Discover</div>
                <div style="padding:8px 10px; color:#333; font-size:15px;">Arcade</div>
                <div style="padding:8px 10px; color:#333; font-size:15px;">Create</div>
                <div style="padding:8px 10px; color:#333; font-size:15px;">Work</div>
                <div style="padding:8px 10px; color:#333; font-size:15px;">Play</div>
            </div>
            <div style="flex:1; display:flex; flex-direction:column; overflow-y:auto;">
                <div style="padding: 20px;">
                    <h1 style="margin:0 0 20px 0; font-weight:600; font-size:28px;">Discover</h1>
                    <div style="height: 200px; background: linear-gradient(135deg, #007aff, #34c759); border-radius: 12px; margin-bottom: 30px; display:flex; flex-direction:column; justify-content:flex-end; padding: 20px; color:#fff; box-shadow: 0 10px 20px rgba(0,0,0,0.15);">
                        <div style="font-size:12px; font-weight:600; text-transform:uppercase; opacity:0.8;">Featured App</div>
                        <div style="font-size:24px; font-weight:bold;">Final Cut Pro</div>
                        <div style="font-size:14px; opacity:0.9;">Professional video editing.</div>
                    </div>
                    
                    <h2 style="margin:0 0 15px 0; font-weight:500; font-size:20px;">Must-Have Apps</h2>
                    <div style="border-top: 1px solid #eee;">
                        ${appCards}
                    </div>
                </div>
            </div>
        </div>
    `;

    if (window.macOS.windowManager) {
        window.macOS.windowManager.createWindow({
            id: 'appstore',
            title: 'App Store',
            width: 850,
            height: 600,
            content: content
        });
    }
}
