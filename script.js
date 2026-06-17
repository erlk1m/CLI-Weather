const input = document.getElementById('command-input');
const output = document.getElementById('output');
const terminalBody = document.getElementById('terminal-body');

const welcomeText = [
    "<span class='sys-msg'>Welcome to CLI Weather Terminal v2.0 (Premium Edition)</span>",
    "<span class='sys-msg'>Establishing secure connection to Open-Meteo satellites... [OK]</span>",
    "<span class='sys-msg'>Type a city name to get the weather forecast (e.g. 'Jakarta' or 'Tokyo').</span>",
    "<span class='sys-msg'>Type 'clear' to clear the screen.</span><br>"
];

async function typeLines(lines, delay = 150) {
    for (let line of lines) {
        await new Promise(r => setTimeout(r, delay));
        printLine(line);
    }
}

// Initial boot sequence
window.onload = () => {
    typeLines(welcomeText, 150);
};

input.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
        const cmd = input.value.trim();
        input.value = '';

        if (!cmd) return;

        printLine(`root@weather-cli:~$ <span class="user-cmd">${cmd}</span>`);

        if (cmd.toLowerCase() === 'clear') {
            output.innerHTML = '';
            return;
        }

        const loaderId = `loader-${Date.now()}`;
        printLine(`<span id="${loaderId}">[<span class="highlight">SYS</span>] Querying weather database for '${cmd}'<span class="cursor-block"></span></span>`);
        
        try {
            const res = await fetch(`/api/weather?city=${encodeURIComponent(cmd)}`);
            const text = await res.text();
            
            document.getElementById(loaderId).remove();
            
            if (res.ok) {
                await fadeInEffect(`<span class="success">${text}</span><br>`);
            } else {
                printLine(`<span class="error">[ERR] ${text}</span><br>`);
            }
        } catch (error) {
            document.getElementById(loaderId).remove();
            printLine(`<span class="error">[FATAL] Connection to atmospheric servers lost.</span><br>`);
        }
    }
});

function printLine(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    div.style.animation = "fadeIn 0.3s ease-out";
    output.appendChild(div);
    scrollToBottom();
}

async function fadeInEffect(htmlContent) {
    const div = document.createElement('div');
    output.appendChild(div);
    
    div.innerHTML = htmlContent;
    div.style.opacity = 0;
    
    let opacity = 0;
    const interval = setInterval(() => {
        opacity += 0.05;
        div.style.opacity = opacity;
        if (opacity >= 1) clearInterval(interval);
    }, 20);
    
    scrollToBottom();
}

function scrollToBottom() {
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

document.addEventListener('click', () => {
    input.focus();
});
