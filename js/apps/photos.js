export function initPhotos() {
    window.macOS = window.macOS || { apps: {} };
    window.macOS.apps.photos = { init: initPhotos, open: openPhotos };
}

export function openPhotos() {
    let photosHtml = '';
    const gradients = [
        'linear-gradient(45deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)',
        'linear-gradient(120deg, #f6d365 0%, #fda085 100%)',
        'linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)',
        'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',
        'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)',
        'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(to right, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(to right, #fa709a 0%, #fee140 100%)',
        'linear-gradient(to top, #30cfd0 0%, #330867 100%)',
        'linear-gradient(to top, #5ee7df 0%, #b490ca 100%)',
        'linear-gradient(to right, #b8cbb8 0%, #b8cbb8 0%, #b465da 0%, #cf6cc9 33%, #ee609c 66%, #ee609c 100%)',
        'linear-gradient(120deg, #f093fb 0%, #f5576c 100%)'
    ];

    gradients.forEach(g => {
        photosHtml += \`<div style="aspect-ratio: 1; background: \${g}; border-radius: 4px; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"></div>\`;
    });

    const content = `
        <div style="display:flex; height:100%; font-family: -apple-system, sans-serif; background:#fff;">
            <div style="width: 200px; border-right: 1px solid #ddd; background: rgba(240,240,240,0.9); padding: 15px 10px; display:flex; flex-direction:column; gap:5px;">
                <div style="font-size:11px; font-weight:600; color:#888; margin-bottom:5px;">Library</div>
                <div style="padding:5px 10px; background:#007aff; color:#fff; border-radius:6px; font-size:13px;">Photos</div>
                <div style="padding:5px 10px; color:#333; font-size:13px;">Memories</div>
                <div style="padding:5px 10px; color:#333; font-size:13px;">People</div>
                
                <div style="font-size:11px; font-weight:600; color:#888; margin-top:15px; margin-bottom:5px;">Albums</div>
                <div style="padding:5px 10px; color:#333; font-size:13px;">Favorites</div>
                <div style="padding:5px 10px; color:#333; font-size:13px;">Recents</div>
            </div>
            <div style="flex:1; padding: 20px; overflow-y:auto;">
                <h2 style="margin-top:0; font-weight:500;">All Photos</h2>
                <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 10px;">
                    ${photosHtml}
                </div>
            </div>
        </div>
    `;

    if (window.macOS.windowManager) {
        window.macOS.windowManager.createWindow({
            id: 'photos',
            title: 'Photos',
            width: 800,
            height: 600,
            content: content
        });
    }
}
