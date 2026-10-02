export function initMaps() {
    window.macOS = window.macOS || { apps: {} };
    window.macOS.apps.maps = { init: initMaps, open: openMaps };
}

export function openMaps() {
    const content = `
        <div style="display:flex; flex-direction:column; height:100%; font-family: -apple-system, sans-serif; position:relative;">
            <div style="position:absolute; top:10px; left:10px; right:10px; display:flex; gap:10px; z-index:10;">
                <input type="text" placeholder="Search Maps" style="flex:1; padding: 8px 15px; border-radius: 8px; border: 1px solid #ccc; box-shadow: 0 2px 6px rgba(0,0,0,0.1); background: rgba(255,255,255,0.9); backdrop-filter: blur(10px); outline:none;">
            </div>
            <div style="flex:1; background: #e8e6e1; display:flex; justify-content:center; align-items:center; position:relative; overflow:hidden;" id="maps-container">
                <!-- Abstract map grid -->
                <div style="width: 2000px; height: 2000px; background-image: 
                    linear-gradient(#d5d3ce 1px, transparent 1px),
                    linear-gradient(90deg, #d5d3ce 1px, transparent 1px);
                    background-size: 50px 50px; position:absolute;">
                </div>
                <!-- Fake green spaces and water -->
                <div style="position:absolute; width: 300px; height: 200px; background: #c6e6c3; border-radius: 20px; top: 30%; left: 20%;"></div>
                <div style="position:absolute; width: 500px; height: 150px; background: #a5c2ef; border-radius: 20px; top: 60%; left: 40%; transform: rotate(-15deg);"></div>
                
                <!-- Pin -->
                <div style="position:absolute; width:16px; height:16px; background:#ff3b30; border-radius:50%; border: 3px solid #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.3); z-index:5;"></div>
            </div>
            <div style="position:absolute; bottom:20px; right:20px; display:flex; flex-direction:column; gap:5px; z-index:10;">
                <button style="width:30px; height:30px; border-radius:4px; background:#fff; border:1px solid #ccc; box-shadow:0 1px 3px rgba(0,0,0,0.1); font-weight:bold;">+</button>
                <button style="width:30px; height:30px; border-radius:4px; background:#fff; border:1px solid #ccc; box-shadow:0 1px 3px rgba(0,0,0,0.1); font-weight:bold;">-</button>
            </div>
        </div>
    `;

    if (window.macOS.windowManager) {
        window.macOS.windowManager.createWindow({
            id: 'maps',
            title: 'Maps',
            width: 800,
            height: 600,
            content: content
        });
    }
}
