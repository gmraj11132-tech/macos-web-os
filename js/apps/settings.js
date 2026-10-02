export function initSettings() {
    window.macOS = window.macOS || { apps: {} };
    window.macOS.apps.settings = { init: initSettings, open: openSettings };
}

export function openSettings() {
    const content = `
        <div style="display:flex; height:100%; font-family: -apple-system, sans-serif; background:#ececec;">
            <div style="width: 220px; background: rgba(230,230,230,0.8); backdrop-filter: blur(20px); border-right: 1px solid #ccc; padding: 15px 10px; display:flex; flex-direction:column; gap: 5px; overflow-y:auto;">
                <div class="settings-nav" style="padding: 8px 10px; border-radius: 6px; background:#007aff; color:#fff; font-size: 13px; cursor:pointer; display:flex; align-items:center; gap:10px;">
                    <div style="width:24px; height:24px; background:#fff; border-radius:4px; display:flex; align-items:center; justify-content:center; color:#007aff;">⚙️</div>
                    General
                </div>
                <div class="settings-nav" style="padding: 8px 10px; border-radius: 6px; color:#333; font-size: 13px; cursor:pointer; display:flex; align-items:center; gap:10px;">
                    <div style="width:24px; height:24px; background:#34c759; border-radius:4px; display:flex; align-items:center; justify-content:center; color:#fff;">🖼️</div>
                    Appearance
                </div>
                <div class="settings-nav" style="padding: 8px 10px; border-radius: 6px; color:#333; font-size: 13px; cursor:pointer; display:flex; align-items:center; gap:10px;">
                    <div style="width:24px; height:24px; background:#007aff; border-radius:4px; display:flex; align-items:center; justify-content:center; color:#fff;">ℹ️</div>
                    About This Mac
                </div>
            </div>
            <div style="flex:1; background: #fff; padding: 40px; display:flex; flex-direction:column; gap:20px; overflow-y:auto;" id="settings-content">
                <h2 style="margin:0; font-weight:500;">General</h2>
                
                <div style="display:flex; flex-direction:column; gap:15px; background:#f9f9f9; padding:20px; border-radius:10px; border: 1px solid #e0e0e0;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-size:14px;">Appearance</span>
                        <select style="padding: 5px 10px; border-radius:6px; border:1px solid #ccc;">
                            <option>Light</option>
                            <option>Dark</option>
                            <option>Auto</option>
                        </select>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-size:14px;">Accent color</span>
                        <div style="display:flex; gap:5px;">
                            <div style="width:20px; height:20px; border-radius:50%; background:#007aff; cursor:pointer; border:2px solid #ccc;"></div>
                            <div style="width:20px; height:20px; border-radius:50%; background:#af52de; cursor:pointer;"></div>
                            <div style="width:20px; height:20px; border-radius:50%; background:#ff2d55; cursor:pointer;"></div>
                            <div style="width:20px; height:20px; border-radius:50%; background:#ff9500; cursor:pointer;"></div>
                            <div style="width:20px; height:20px; border-radius:50%; background:#34c759; cursor:pointer;"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    if (window.macOS.windowManager) {
        window.macOS.windowManager.createWindow({
            id: 'settings',
            title: 'System Settings',
            width: 750,
            height: 550,
            content: content
        });
    }
}
