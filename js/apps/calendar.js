export function initCalendar() {
    window.macOS = window.macOS || { apps: {} };
    window.macOS.apps.calendar = { init: initCalendar, open: openCalendar };
}

export function openCalendar() {
    const today = new Date();
    const month = today.toLocaleString('default', { month: 'long' });
    const year = today.getFullYear();

    let gridHTML = '';
    for(let i=0; i<35; i++) {
        let isToday = i === 15; // mock today for visual
        gridHTML += \`<div style="border-right: 1px solid #eee; border-bottom: 1px solid #eee; padding: 5px; min-height: 80px;">
            <div style="font-size:12px; \${isToday ? 'background:#ff3b30; color:#fff; width:20px; height:20px; border-radius:50%; display:flex; align-items:center; justify-content:center;' : 'color:#333;'}">\${(i%31)+1}</div>
        </div>\`;
    }

    const content = `
        <div style="display:flex; flex-direction:column; height:100%; font-family: -apple-system, sans-serif; background:#fff;">
            <div style="display:flex; justify-content:space-between; align-items:center; padding: 10px 20px; border-bottom: 1px solid #ddd; background: #f9f9f9;">
                <div style="display:flex; gap:15px; align-items:center;">
                    <button style="border:1px solid #ccc; background:#fff; border-radius:6px; padding: 5px 10px;">Today</button>
                    <div style="display:flex; gap:5px;">
                        <button style="border:none; background:none; font-size:16px;">◀</button>
                        <button style="border:none; background:none; font-size:16px;">▶</button>
                    </div>
                    <h2 style="margin:0; font-weight:500; font-size: 20px;">${month} ${year}</h2>
                </div>
                <div style="display:flex; border: 1px solid #ccc; border-radius:6px; overflow:hidden;">
                    <div style="padding: 5px 15px; background: #e0e0e0; font-size:13px;">Day</div>
                    <div style="padding: 5px 15px; background: #fff; border-left: 1px solid #ccc; font-size:13px;">Week</div>
                    <div style="padding: 5px 15px; background: #fff; border-left: 1px solid #ccc; font-size:13px; font-weight:600;">Month</div>
                </div>
            </div>
            <div style="display:grid; grid-template-columns: repeat(7, 1fr); border-bottom: 1px solid #ddd; background:#f9f9f9;">
                <div style="padding: 10px; text-align:center; font-size:11px; font-weight:600; color:#888;">SUN</div>
                <div style="padding: 10px; text-align:center; font-size:11px; font-weight:600; color:#888;">MON</div>
                <div style="padding: 10px; text-align:center; font-size:11px; font-weight:600; color:#888;">TUE</div>
                <div style="padding: 10px; text-align:center; font-size:11px; font-weight:600; color:#888;">WED</div>
                <div style="padding: 10px; text-align:center; font-size:11px; font-weight:600; color:#888;">THU</div>
                <div style="padding: 10px; text-align:center; font-size:11px; font-weight:600; color:#888;">FRI</div>
                <div style="padding: 10px; text-align:center; font-size:11px; font-weight:600; color:#888;">SAT</div>
            </div>
            <div style="flex:1; display:grid; grid-template-columns: repeat(7, 1fr); grid-auto-rows: minmax(80px, 1fr); overflow-y:auto; border-left: 1px solid #eee;">
                ${gridHTML}
            </div>
        </div>
    `;

    if (window.macOS.windowManager) {
        window.macOS.windowManager.createWindow({
            id: 'calendar',
            title: 'Calendar',
            width: 800,
            height: 600,
            content: content
        });
    }
}
