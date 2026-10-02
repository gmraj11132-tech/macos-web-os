export function initTerminal() {
    window.macOS = window.macOS || { apps: {} };
    window.macOS.apps.terminal = { init: initTerminal, open: openTerminal };
}

export function openTerminal() {
    const content = `
        <div style="background: rgba(30, 30, 30, 0.95); color: #00ff00; font-family: monospace; height: 100%; padding: 10px; box-sizing: border-box; overflow-y: auto; display: flex; flex-direction: column;" id="terminal-container">
            <div id="terminal-output" style="white-space: pre-wrap; margin-bottom: 5px;">Last login: ${new Date().toString()} on console
</div>
            <div style="display: flex;">
                <span style="color: #fff;">admin@MacBook-Web ~ %&nbsp;</span>
                <input type="text" id="terminal-input" style="background: transparent; border: none; color: #00ff00; font-family: monospace; flex: 1; outline: none; caret-color: #fff;" autocomplete="off" spellcheck="false" autofocus>
            </div>
        </div>
    `;

    if (window.macOS.windowManager) {
        const win = window.macOS.windowManager.createWindow({
            id: 'terminal',
            title: 'Terminal',
            width: 600,
            height: 400,
            content: content
        });

        setTimeout(() => {
            const doc = document.getElementById(win.id);
            if(doc) {
                const input = doc.querySelector('#terminal-input');
                const output = doc.querySelector('#terminal-output');
                const container = doc.querySelector('#terminal-container');
                let pwd = '/Users/admin';
                
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        const cmdStr = input.value.trim();
                        output.innerHTML += \`<br><span style="color: #fff;">admin@MacBook-Web \${pwd.split('/').pop()} %</span> \${cmdStr}<br>\`;
                        input.value = '';
                        
                        const args = cmdStr.split(' ');
                        const cmd = args[0];
                        
                        switch(cmd) {
                            case 'pwd': output.innerHTML += pwd; break;
                            case 'ls': output.innerHTML += 'Desktop\\nDocuments\\nDownloads\\nApplications'; break;
                            case 'whoami': output.innerHTML += 'admin'; break;
                            case 'date': output.innerHTML += new Date().toString(); break;
                            case 'clear': output.innerHTML = ''; break;
                            case 'echo': output.innerHTML += args.slice(1).join(' '); break;
                            case 'neofetch': 
                                output.innerHTML += \`<span style="color:#00ffff">
       /\\\\         OS: macOS Web
      /  \\\\        Host: MacBook-Web
     /____\\\\       Kernel: 1.0.0
    /      \\\\      Uptime: 10 mins
   /        \\\\     Shell: bash
  /__________\\\\    Terminal: WebTerminal</span>\`; 
                                break;
                            case 'uname': output.innerHTML += 'Darwin MacBook-Web 22.1.0 Darwin Kernel Version 22.1.0'; break;
                            case '': break;
                            default: output.innerHTML += \`bash: \${cmd}: command not found\`;
                        }
                        container.scrollTop = container.scrollHeight;
                    }
                });
                
                container.addEventListener('click', () => input.focus());
            }
        }, 100);
    }
}
