export function initTextEdit() {
    window.macOS = window.macOS || { apps: {} };
    window.macOS.apps.textedit = { init: initTextEdit, open: openTextEdit };
}

export function openTextEdit(filePath = null) {
    const content = `
        <div style="display:flex; flex-direction:column; height:100%; font-family: -apple-system, sans-serif; background:#fff;">
            <div style="padding: 10px; border-bottom: 1px solid #ddd; display:flex; gap:10px; background:#f0f0f0; align-items:center;">
                <button onclick="document.execCommand('bold')"><b>B</b></button>
                <button onclick="document.execCommand('italic')"><i>I</i></button>
                <button onclick="document.execCommand('underline')"><u>U</u></button>
                <span style="color:#ccc;">|</span>
                <button onclick="document.execCommand('justifyLeft')">Left</button>
                <button onclick="document.execCommand('justifyCenter')">Center</button>
                <button onclick="document.execCommand('justifyRight')">Right</button>
            </div>
            <div style="background:#e0e0e0; flex:1; display:flex; justify-content:center; padding: 20px; overflow-y:auto;">
                <div contenteditable="true" style="background:#fff; width: 80%; max-width:800px; min-height: 100%; box-shadow: 0 4px 6px rgba(0,0,0,0.1); padding: 40px; outline:none; font-size:14px; line-height:1.6;" id="textedit-editor">
                    Start typing here...
                </div>
            </div>
            <div style="padding: 4px 10px; background:#f0f0f0; border-top: 1px solid #ddd; font-size: 11px; color: #666; display:flex; justify-content:space-between;">
                <span>Untitled.rtf</span>
                <span id="textedit-stats">0 words, 0 chars</span>
            </div>
        </div>
    `;

    if (window.macOS.windowManager) {
        const win = window.macOS.windowManager.createWindow({
            id: 'textedit',
            title: 'TextEdit',
            width: 700,
            height: 600,
            content: content
        });
        
        setTimeout(() => {
            const doc = document.getElementById(win.id);
            if(doc) {
                const editor = doc.querySelector('#textedit-editor');
                const stats = doc.querySelector('#textedit-stats');
                editor.addEventListener('input', () => {
                    const text = editor.innerText || '';
                    const chars = text.length;
                    const words = text.trim() === '' ? 0 : text.trim().split(/\\s+/).length;
                    stats.innerText = \`\${words} words, \${chars} chars\`;
                });
            }
        }, 100);
    }
}
