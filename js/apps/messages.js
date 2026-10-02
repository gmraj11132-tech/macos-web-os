export function initMessages() {
    window.macOS = window.macOS || { apps: {} };
    window.macOS.apps.messages = { init: initMessages, open: openMessages };
}

export function openMessages() {
    const content = `
        <div style="display:flex; height:100%; font-family: -apple-system, sans-serif; background:#fff;">
            <div style="width: 250px; border-right: 1px solid #ddd; background: #f9f9f9; display:flex; flex-direction:column;">
                <div style="padding: 15px 10px; border-bottom: 1px solid #ddd; display:flex; justify-content:space-between; align-items:center;">
                    <div style="font-weight:600;">Messages</div>
                    <button style="border:none; background:none; color:#007aff; font-size:20px; cursor:pointer;">📝</button>
                </div>
                <div style="padding: 10px;">
                    <input type="text" placeholder="Search" style="width:100%; box-sizing:border-box; padding: 6px 10px; border-radius:6px; border:1px solid #ccc; outline:none;">
                </div>
                <div style="flex:1; overflow-y:auto;">
                    <div style="display:flex; gap:10px; padding: 10px; background:#007aff; color:#fff; align-items:center;">
                        <div style="width:40px; height:40px; background:#fff; color:#007aff; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:16px;">SJ</div>
                        <div style="flex:1;">
                            <div style="display:flex; justify-content:space-between;">
                                <span style="font-weight:600;">Steve Jobs</span>
                                <span style="font-size:11px; opacity:0.8;">9:41 AM</span>
                            </div>
                            <div style="font-size:13px; opacity:0.9; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; width:150px;">Stay hungry, stay foolish.</div>
                        </div>
                    </div>
                    <div style="display:flex; gap:10px; padding: 10px; align-items:center; border-bottom:1px solid #eee;">
                        <div style="width:40px; height:40px; background:#34c759; color:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:16px;">TC</div>
                        <div style="flex:1; color:#333;">
                            <div style="display:flex; justify-content:space-between;">
                                <span style="font-weight:600;">Tim Cook</span>
                                <span style="font-size:11px; color:#888;">Yesterday</span>
                            </div>
                            <div style="font-size:13px; color:#666; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; width:150px;">Good morning!</div>
                        </div>
                    </div>
                </div>
            </div>
            <div style="flex:1; display:flex; flex-direction:column; background:#fff;">
                <div style="padding: 15px; border-bottom: 1px solid #ddd; background: #f9f9f9; display:flex; justify-content:center; align-items:center;">
                    <div style="display:flex; flex-direction:column; align-items:center;">
                        <div style="width:30px; height:30px; background:#ccc; color:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:12px;">SJ</div>
                        <div style="font-size:11px; margin-top:4px;">Steve Jobs</div>
                    </div>
                </div>
                <div style="flex:1; padding: 20px; overflow-y:auto; display:flex; flex-direction:column; gap:15px;">
                    <div style="text-align:center; font-size:11px; color:#888;">Today 9:40 AM</div>
                    
                    <div style="display:flex; flex-direction:column; align-items:flex-end;">
                        <div style="background:#007aff; color:#fff; padding: 8px 12px; border-radius: 18px 18px 4px 18px; max-width:70%; font-size:14px; line-height:1.4;">
                            Hello Steve! How is the new product coming along?
                        </div>
                        <div style="font-size:10px; color:#888; margin-top:2px;">Delivered</div>
                    </div>
                    
                    <div style="display:flex; flex-direction:column; align-items:flex-start;">
                        <div style="background:#e5e5ea; color:#000; padding: 8px 12px; border-radius: 18px 18px 18px 4px; max-width:70%; font-size:14px; line-height:1.4;">
                            Stay hungry, stay foolish.
                        </div>
                    </div>
                </div>
                <div style="padding: 15px; border-top: 1px solid #ddd; display:flex; gap:10px; align-items:center;">
                    <input type="text" placeholder="iMessage" style="flex:1; padding: 8px 15px; border-radius:18px; border:1px solid #ccc; outline:none; font-size:14px;">
                    <button style="border:none; background:none; font-size:24px; color:#007aff; cursor:pointer;">↑</button>
                </div>
            </div>
        </div>
    `;

    if (window.macOS.windowManager) {
        window.macOS.windowManager.createWindow({
            id: 'messages',
            title: 'Messages',
            width: 700,
            height: 500,
            content: content
        });
    }
}
