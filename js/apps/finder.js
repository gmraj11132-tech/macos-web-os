export function initFinder() {
    window.macOS = window.macOS || { apps: {} };
    window.macOS.apps.finder = { init: initFinder, open: openFinder };
}

export function openFinder(path = '/') {
    const content = `
        <div style="display:flex; height:100%; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
            <div style="width: 200px; background: rgba(240,240,240,0.8); backdrop-filter: blur(10px); padding: 10px; border-right: 1px solid #ccc; overflow-y: auto;">
                <div style="font-size: 11px; font-weight: 600; color: #888; margin-bottom: 5px;">Favorites</div>
                <ul style="list-style:none; padding:0; margin:0; font-size: 13px;">
                    <li style="padding: 4px; cursor: pointer; border-radius: 4px;">AirDrop</li>
                    <li style="padding: 4px; cursor: pointer; border-radius: 4px;">Recents</li>
                    <li style="padding: 4px; cursor: pointer; border-radius: 4px;">Applications</li>
                    <li style="padding: 4px; cursor: pointer; border-radius: 4px; background: #cce3ff;">Desktop</li>
                    <li style="padding: 4px; cursor: pointer; border-radius: 4px;">Documents</li>
                    <li style="padding: 4px; cursor: pointer; border-radius: 4px;">Downloads</li>
                </ul>
                <div style="font-size: 11px; font-weight: 600; color: #888; margin-top: 15px; margin-bottom: 5px;">Locations</div>
                <ul style="list-style:none; padding:0; margin:0; font-size: 13px;">
                    <li style="padding: 4px; cursor: pointer; border-radius: 4px;">MacBook</li>
                </ul>
            </div>
            <div style="flex: 1; display: flex; flex-direction: column; background: #fff;">
                <div style="padding: 10px; border-bottom: 1px solid #ddd; display: flex; gap: 10px; align-items: center;">
                    <button id="btn-back">⬅</button>
                    <button id="btn-fwd">➡</button>
                    <span style="font-weight: 600;">Desktop</span>
                    <div style="flex:1;"></div>
                    <input type="text" placeholder="Search" style="padding: 4px; border-radius: 12px; border: 1px solid #ccc; outline: none; width: 150px;">
                </div>
                <div style="flex: 1; padding: 10px; display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 15px; overflow-y: auto;" id="finder-content">
                    <!-- Files -->
                    <div style="display:flex; flex-direction:column; align-items:center; cursor:pointer;" ondblclick="alert('Opening Folder')">
                        <div style="font-size: 32px;">📁</div>
                        <span style="font-size: 12px; margin-top: 5px;">Work</span>
                    </div>
                    <div style="display:flex; flex-direction:column; align-items:center; cursor:pointer;" ondblclick="alert('Opening File')">
                        <div style="font-size: 32px;">📄</div>
                        <span style="font-size: 12px; margin-top: 5px;">notes.txt</span>
                    </div>
                </div>
                <div style="padding: 5px 10px; border-top: 1px solid #ddd; font-size: 11px; color: #666; background: #f9f9f9;">
                    MacBook > Desktop > 2 items
                </div>
            </div>
        </div>
    `;

    if (window.macOS.windowManager) {
        window.macOS.windowManager.createWindow({
            id: 'finder',
            title: 'Finder',
            width: 700,
            height: 450,
            content: content
        });
    } else {
        console.log("Mock open finder", path);
    }
}
