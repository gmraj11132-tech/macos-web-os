export function initMail() {
    window.macOS = window.macOS || { apps: {} };
    window.macOS.apps.mail = { init: initMail, open: openMail };
}

export function openMail() {
    const content = `
        <div style="display:flex; height:100%; font-family: -apple-system, sans-serif; background:#fff;">
            <div style="width: 180px; border-right: 1px solid #ddd; background: #f9f9f9; padding: 10px 0;">
                <div style="font-size:11px; font-weight:600; color:#888; margin: 0 15px 5px 15px;">Favorites</div>
                <div style="padding: 5px 15px; background: #007aff; color: #fff; font-size:13px; display:flex; justify-content:space-between;">
                    <span>Inbox</span>
                    <span>3</span>
                </div>
                <div style="padding: 5px 15px; color: #333; font-size:13px;">Sent</div>
                <div style="padding: 5px 15px; color: #333; font-size:13px;">Drafts</div>
                <div style="padding: 5px 15px; color: #333; font-size:13px;">Trash</div>
            </div>
            
            <div style="width: 250px; border-right: 1px solid #ddd; background: #fff; display:flex; flex-direction:column;">
                <div style="padding: 10px; border-bottom: 1px solid #ddd; font-weight:600; background:#f9f9f9;">Inbox</div>
                <div style="flex:1; overflow-y:auto;">
                    <div style="padding: 10px; border-bottom: 1px solid #eee; background: #e0f0ff;">
                        <div style="display:flex; justify-content:space-between; align-items:baseline;">
                            <div style="font-weight:600; font-size:14px; display:flex; align-items:center; gap:5px;">
                                <div style="width:8px; height:8px; background:#007aff; border-radius:50%;"></div>
                                Apple
                            </div>
                            <div style="font-size:11px; color:#888;">9:41 AM</div>
                        </div>
                        <div style="font-weight:500; font-size:13px; margin-top:2px;">Your receipt from Apple</div>
                        <div style="font-size:12px; color:#666; margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">Thank you for your purchase...</div>
                    </div>
                    
                    <div style="padding: 10px; border-bottom: 1px solid #eee;">
                        <div style="display:flex; justify-content:space-between; align-items:baseline;">
                            <div style="font-weight:600; font-size:14px; display:flex; align-items:center; gap:5px;">
                                GitHub
                            </div>
                            <div style="font-size:11px; color:#888;">Yesterday</div>
                        </div>
                        <div style="font-weight:500; font-size:13px; margin-top:2px;">[maCOS] New pull request</div>
                        <div style="font-size:12px; color:#666; margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">Someone opened a pull request...</div>
                    </div>
                </div>
            </div>
            
            <div style="flex:1; display:flex; flex-direction:column; background:#fff;">
                <div style="padding: 15px; border-bottom: 1px solid #ddd; display:flex; justify-content:space-between; background:#f9f9f9;">
                    <div>
                        <div style="font-weight:600; font-size:18px;">Your receipt from Apple</div>
                        <div style="font-size:13px; color:#666; margin-top:5px;">From: Apple &lt;no-reply@apple.com&gt;</div>
                        <div style="font-size:13px; color:#666;">To: You</div>
                    </div>
                    <div style="color:#888; font-size:12px;">October 1, 2026 at 9:41 AM</div>
                </div>
                <div style="flex:1; padding: 20px; font-size:14px; line-height:1.5; overflow-y:auto;">
                    <div style="text-align:center; padding: 20px 0; border-bottom: 1px solid #eee; margin-bottom:20px;">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" width="30" alt="Apple">
                    </div>
                    <p><strong>Receipt</strong></p>
                    <p>Order ID: MXX1234567<br>
                    Document No. 1234567890</p>
                    
                    <table style="width:100%; border-collapse:collapse; margin-top:20px;">
                        <tr style="border-bottom:1px solid #eee;">
                            <td style="padding:10px 0;">iCloud+ with 50GB Storage</td>
                            <td style="text-align:right;">$0.99</td>
                        </tr>
                        <tr>
                            <td style="padding:10px 0; font-weight:bold;">Total</td>
                            <td style="text-align:right; font-weight:bold;">$0.99</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    `;

    if (window.macOS.windowManager) {
        window.macOS.windowManager.createWindow({
            id: 'mail',
            title: 'Mail',
            width: 850,
            height: 600,
            content: content
        });
    }
}
