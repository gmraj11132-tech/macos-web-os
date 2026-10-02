export function initMusic() {
    window.macOS = window.macOS || { apps: {} };
    window.macOS.apps.music = { init: initMusic, open: openMusic };
}

export function openMusic() {
    const songs = [
        {title: 'Sunset Dreams', artist: 'The Chillers', album: 'Summer Vibes', time: '3:45'},
        {title: 'Neon Lights', artist: 'Synthwave Kids', album: 'Retro Future', time: '4:12'},
        {title: 'Ocean Breeze', artist: 'Acoustic Soul', album: 'Nature Sounds', time: '2:58'},
        {title: 'Midnight Drive', artist: 'Nightcrawlers', album: 'City Streets', time: '5:01'},
        {title: 'Mountain High', artist: 'Folk Heroes', album: 'Wilderness', time: '3:22'}
    ];

    let songList = '';
    songs.forEach((s, i) => {
        songList += \`<div style="display:grid; grid-template-columns: 30px 2fr 1.5fr 1.5fr 50px; padding: 10px; border-bottom: 1px solid #eee; font-size:13px; align-items:center;">
            <div style="color:#888;">\${i+1}</div>
            <div style="font-weight:500;">\${s.title}</div>
            <div style="color:#666;">\${s.artist}</div>
            <div style="color:#666;">\${s.album}</div>
            <div style="color:#888; text-align:right;">\${s.time}</div>
        </div>\`;
    });

    const content = `
        <div style="display:flex; flex-direction:column; height:100%; font-family: -apple-system, sans-serif; background:#fff;">
            <div style="display:flex; flex:1; overflow:hidden;">
                <div style="width: 200px; border-right: 1px solid #ddd; background: #f9f9f9; padding: 15px 10px;">
                    <div style="font-size:11px; font-weight:600; color:#888; margin-bottom:5px;">Apple Music</div>
                    <div style="padding:5px 10px; color:#333; font-size:13px;">Listen Now</div>
                    <div style="padding:5px 10px; color:#333; font-size:13px;">Browse</div>
                    <div style="padding:5px 10px; color:#333; font-size:13px;">Radio</div>
                    
                    <div style="font-size:11px; font-weight:600; color:#888; margin-top:15px; margin-bottom:5px;">Library</div>
                    <div style="padding:5px 10px; color:#333; font-size:13px;">Recently Added</div>
                    <div style="padding:5px 10px; color:#333; font-size:13px;">Artists</div>
                    <div style="padding:5px 10px; color:#333; font-size:13px;">Albums</div>
                    <div style="padding:5px 10px; background:#e0e0e0; border-radius:6px; color:#333; font-size:13px; font-weight:500;">Songs</div>
                </div>
                <div style="flex:1; display:flex; flex-direction:column;">
                    <div style="padding: 20px;">
                        <h2 style="margin-top:0; font-weight:500;">Songs</h2>
                    </div>
                    <div style="display:grid; grid-template-columns: 30px 2fr 1.5fr 1.5fr 50px; padding: 5px 10px; border-bottom: 1px solid #ccc; font-size:12px; font-weight:600; color:#888;">
                        <div>#</div>
                        <div>TITLE</div>
                        <div>ARTIST</div>
                        <div>ALBUM</div>
                        <div style="text-align:right;">TIME</div>
                    </div>
                    <div style="flex:1; overflow-y:auto;">
                        ${songList}
                    </div>
                </div>
            </div>
            <div style="height: 80px; background: rgba(240,240,240,0.95); backdrop-filter: blur(10px); border-top: 1px solid #ccc; display:flex; align-items:center; padding: 0 20px; gap: 20px;">
                <div style="display:flex; gap:15px; align-items:center;">
                    <button style="border:none; background:none; font-size:20px; cursor:pointer;">⏮</button>
                    <button style="border:none; background:none; font-size:32px; cursor:pointer;" id="music-play">▶</button>
                    <button style="border:none; background:none; font-size:20px; cursor:pointer;">⏭</button>
                </div>
                <div style="flex:1; border: 1px solid #ccc; border-radius: 6px; height: 50px; background:#fff; display:flex; align-items:center; padding: 0 10px; gap:10px; box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);">
                    <div style="width:36px; height:36px; background: linear-gradient(45deg, #ff9a9e, #fecfef); border-radius:4px;"></div>
                    <div style="display:flex; flex-direction:column; flex:1;">
                        <div style="display:flex; justify-content:center; align-items:center; gap: 10px;">
                            <div style="font-size:12px; font-weight:600;">Sunset Dreams - The Chillers</div>
                        </div>
                        <div style="display:flex; align-items:center; gap: 10px;">
                            <span style="font-size:10px; color:#888;">1:20</span>
                            <div style="flex:1; height:4px; background:#ddd; border-radius:2px; overflow:hidden;">
                                <div style="width:30%; height:100%; background:#888;"></div>
                            </div>
                            <span style="font-size:10px; color:#888;">-2:25</span>
                        </div>
                    </div>
                </div>
                <div style="display:flex; align-items:center; gap:5px; width:100px;">
                    <span style="font-size:16px;">🔈</span>
                    <input type="range" style="width:100%;">
                </div>
            </div>
        </div>
    `;

    if (window.macOS.windowManager) {
        window.macOS.windowManager.createWindow({
            id: 'music',
            title: 'Music',
            width: 800,
            height: 600,
            content: content
        });
    }
}
