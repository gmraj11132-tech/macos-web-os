export function initCalculator() {
    window.macOS = window.macOS || { apps: {} };
    window.macOS.apps.calculator = { init: initCalculator, open: openCalculator };
}

export function openCalculator() {
    const content = `
        <div style="background: rgba(40,40,40,0.9); height:100%; border-radius:10px; display:flex; flex-direction:column; padding: 10px; font-family: -apple-system, sans-serif; user-select:none;">
            <div id="calc-display" style="flex:1; display:flex; align-items:flex-end; justify-content:flex-end; color:#fff; font-size:48px; padding-bottom:10px; font-weight:300;">0</div>
            <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap: 10px; height: 75%;">
                <button class="calc-btn fn" style="background:#a5a5a5; color:#000; border:none; border-radius:50%; font-size:20px;">C</button>
                <button class="calc-btn fn" style="background:#a5a5a5; color:#000; border:none; border-radius:50%; font-size:20px;">±</button>
                <button class="calc-btn fn" style="background:#a5a5a5; color:#000; border:none; border-radius:50%; font-size:20px;">%</button>
                <button class="calc-btn op" style="background:#ff9f0a; color:#fff; border:none; border-radius:50%; font-size:24px;">÷</button>
                
                <button class="calc-btn num" style="background:#333; color:#fff; border:none; border-radius:50%; font-size:24px;">7</button>
                <button class="calc-btn num" style="background:#333; color:#fff; border:none; border-radius:50%; font-size:24px;">8</button>
                <button class="calc-btn num" style="background:#333; color:#fff; border:none; border-radius:50%; font-size:24px;">9</button>
                <button class="calc-btn op" style="background:#ff9f0a; color:#fff; border:none; border-radius:50%; font-size:24px;">×</button>
                
                <button class="calc-btn num" style="background:#333; color:#fff; border:none; border-radius:50%; font-size:24px;">4</button>
                <button class="calc-btn num" style="background:#333; color:#fff; border:none; border-radius:50%; font-size:24px;">5</button>
                <button class="calc-btn num" style="background:#333; color:#fff; border:none; border-radius:50%; font-size:24px;">6</button>
                <button class="calc-btn op" style="background:#ff9f0a; color:#fff; border:none; border-radius:50%; font-size:24px;">-</button>
                
                <button class="calc-btn num" style="background:#333; color:#fff; border:none; border-radius:50%; font-size:24px;">1</button>
                <button class="calc-btn num" style="background:#333; color:#fff; border:none; border-radius:50%; font-size:24px;">2</button>
                <button class="calc-btn num" style="background:#333; color:#fff; border:none; border-radius:50%; font-size:24px;">3</button>
                <button class="calc-btn op" style="background:#ff9f0a; color:#fff; border:none; border-radius:50%; font-size:24px;">+</button>
                
                <button class="calc-btn num" style="background:#333; color:#fff; border:none; border-radius:30px; grid-column: span 2; font-size:24px; text-align:left; padding-left:25px;">0</button>
                <button class="calc-btn num" style="background:#333; color:#fff; border:none; border-radius:50%; font-size:24px;">.</button>
                <button class="calc-btn op" style="background:#ff9f0a; color:#fff; border:none; border-radius:50%; font-size:24px;">=</button>
            </div>
        </div>
    `;

    if (window.macOS.windowManager) {
        const win = window.macOS.windowManager.createWindow({
            id: 'calculator',
            title: 'Calculator',
            width: 250,
            height: 350,
            content: content
        });
        
        setTimeout(() => {
            const doc = document.getElementById(win.id);
            if(doc) {
                const display = doc.querySelector('#calc-display');
                const btns = doc.querySelectorAll('.calc-btn');
                let current = '0', op = null, previous = null;
                
                btns.forEach(b => {
                    b.addEventListener('click', (e) => {
                        const val = e.target.innerText;
                        if (!isNaN(val) || val === '.') {
                            if (current === '0' && val !== '.') current = val;
                            else current += val;
                        } else if (val === 'C') {
                            current = '0'; op = null; previous = null;
                        } else if (val === '=') {
                            if (op && previous !== null) {
                                let res = 0;
                                const p = parseFloat(previous), c = parseFloat(current);
                                if (op === '+') res = p + c;
                                if (op === '-') res = p - c;
                                if (op === '×') res = p * c;
                                if (op === '÷') res = c === 0 ? 'Error' : p / c;
                                current = res.toString();
                                op = null; previous = null;
                            }
                        } else if (['+','-','×','÷'].includes(val)) {
                            op = val;
                            previous = current;
                            current = '0';
                        }
                        display.innerText = current;
                    });
                });
            }
        }, 100);
    }
}
