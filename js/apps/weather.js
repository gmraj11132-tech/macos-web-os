export function initWeather() {
    window.macOS = window.macOS || { apps: {} };
    window.macOS.apps.weather = { init: initWeather, open: openWeather };
}

export function openWeather() {
    const content = `
        <div style="display:flex; flex-direction:column; height:100%; font-family: -apple-system, sans-serif; background: linear-gradient(to bottom, #4a90e2, #90c2f9); color:#fff; padding: 20px; box-sizing:border-box;">
            <div style="text-align:center; margin-bottom: 30px;">
                <h1 style="margin:0; font-size:32px; font-weight:400; text-shadow: 0 1px 3px rgba(0,0,0,0.2);">Cupertino</h1>
                <div style="font-size: 72px; font-weight:200; margin: 10px 0; text-shadow: 0 2px 5px rgba(0,0,0,0.2);">72°</div>
                <div style="font-size: 20px; font-weight:500; text-shadow: 0 1px 3px rgba(0,0,0,0.2);">☀️ Sunny</div>
                <div style="font-size: 16px; margin-top:5px; opacity:0.9;">H: 78° L: 55°</div>
            </div>
            
            <div style="background: rgba(0,0,0,0.2); backdrop-filter: blur(10px); border-radius: 15px; padding: 15px; margin-bottom: 15px;">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom:10px; margin-bottom:10px;">
                    <div style="display:flex; flex-direction:column; align-items:center; gap:5px;">
                        <span>Now</span>
                        <span style="font-size:24px;">☀️</span>
                        <span>72°</span>
                    </div>
                    <div style="display:flex; flex-direction:column; align-items:center; gap:5px;">
                        <span>1 PM</span>
                        <span style="font-size:24px;">☀️</span>
                        <span>75°</span>
                    </div>
                    <div style="display:flex; flex-direction:column; align-items:center; gap:5px;">
                        <span>2 PM</span>
                        <span style="font-size:24px;">🌤️</span>
                        <span>77°</span>
                    </div>
                    <div style="display:flex; flex-direction:column; align-items:center; gap:5px;">
                        <span>3 PM</span>
                        <span style="font-size:24px;">☁️</span>
                        <span>78°</span>
                    </div>
                    <div style="display:flex; flex-direction:column; align-items:center; gap:5px;">
                        <span>4 PM</span>
                        <span style="font-size:24px;">☁️</span>
                        <span>76°</span>
                    </div>
                </div>
            </div>
            
            <div style="display:flex; gap: 15px;">
                <div style="flex:1; background: rgba(0,0,0,0.2); backdrop-filter: blur(10px); border-radius: 15px; padding: 15px; display:flex; flex-direction:column; gap:5px;">
                    <div style="font-size:12px; opacity:0.8; text-transform:uppercase;">UV Index</div>
                    <div style="font-size:24px; font-weight:500;">5</div>
                    <div style="font-size:16px;">Moderate</div>
                </div>
                <div style="flex:1; background: rgba(0,0,0,0.2); backdrop-filter: blur(10px); border-radius: 15px; padding: 15px; display:flex; flex-direction:column; gap:5px;">
                    <div style="font-size:12px; opacity:0.8; text-transform:uppercase;">Humidity</div>
                    <div style="font-size:24px; font-weight:500;">45%</div>
                    <div style="font-size:14px; opacity:0.9;">The dew point is 50° right now.</div>
                </div>
            </div>
        </div>
    `;

    if (window.macOS.windowManager) {
        window.macOS.windowManager.createWindow({
            id: 'weather',
            title: 'Weather',
            width: 400,
            height: 600,
            content: content
        });
    }
}
