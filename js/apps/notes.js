export function initNotes() {
    window.macOS = window.macOS || { apps: {} };
    window.macOS.apps.notes = { init: initNotes, open: openNotes };
}

export function openNotes() {
    const content = `
        <div style="display:flex; height:100%; font-family: -apple-system, sans-serif; background:#fff;">
            <div style="width: 250px; border-right: 1px solid #ddd; background: #f9f9f9; display:flex; flex-direction:column;">
                <div style="padding: 10px; border-bottom: 1px solid #ddd; display:flex; justify-content:space-between; align-items:center;">
                    <button style="border:none; background:none; font-size:20px; cursor:pointer;" id="notes-add">📝</button>
                    <button style="border:none; background:none; font-size:20px; cursor:pointer;">🗑️</button>
                </div>
                <div style="flex:1; overflow-y:auto;" id="notes-list">
                    <div style="padding: 15px; border-bottom: 1px solid #eee; background: #e8e8e8; cursor:pointer;">
                        <div style="font-weight:600; font-size:14px; margin-bottom:5px;">Welcome to Notes</div>
                        <div style="font-size:12px; color:#666; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${new Date().toLocaleDateString()} - This is a Web OS Note app.</div>
                    </div>
                </div>
            </div>
            <div style="flex:1; display:flex; flex-direction:column;">
                <div style="padding: 10px; border-bottom: 1px solid #ddd; display:flex; gap:10px; background:#fff;">
                    <button style="font-weight:bold; width:30px; border:1px solid #ccc; border-radius:4px; cursor:pointer;" onclick="document.execCommand('bold')">B</button>
                    <button style="font-style:italic; width:30px; border:1px solid #ccc; border-radius:4px; cursor:pointer;" onclick="document.execCommand('italic')">I</button>
                    <button style="text-decoration:underline; width:30px; border:1px solid #ccc; border-radius:4px; cursor:pointer;" onclick="document.execCommand('underline')">U</button>
                </div>
                <div id="notes-editor" contenteditable="true" style="flex:1; padding: 20px; font-size: 14px; outline:none; overflow-y:auto; line-height:1.5;">
                    <div><b>Welcome to Notes</b></div>
                    <div><br></div>
                    <div>This is a fully functional rich text notes app. Try editing this text!</div>
                </div>
            </div>
        </div>
    `;

    if (window.macOS.windowManager) {
        window.macOS.windowManager.createWindow({
            id: 'notes',
            title: 'Notes',
            width: 700,
            height: 500,
            content: content
        });
    }
}
