const input = document.getElementById('command-input');
const output = document.querySelector('.output');
const terminalBody = document.getElementById('terminal-body');

input.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
        const cmd = input.value.trim();
        input.value = '';

        if (!cmd) return;

        // Echo command
        printLine(`root@weather-cli:~$ <span class="user-cmd">${cmd}</span>`);

        if (cmd.toLowerCase() === 'clear') {
            output.innerHTML = '';
            scrollToBottom();
            return;
        }

        // Show loading
        const loaderId = `loader-${Date.now()}`;
        printLine(`<span id="${loaderId}">Fetching data for '${cmd}' <span class="loader">...</span></span>`);
        
        try {
            const res = await fetch(`/api/weather?city=${encodeURIComponent(cmd)}`);
            const text = await res.text();
            
            document.getElementById(loaderId).remove();
            
            if (res.ok) {
                printLine(`<span style="color: #0ff">${text}</span><br>`);
            } else {
                printLine(`<span class="error">${text}</span><br>`);
            }
        } catch (error) {
            document.getElementById(loaderId).remove();
            printLine(`<span class="error">Error connecting to server.</span><br>`);
        }
    }
});

function printLine(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    output.appendChild(div);
    scrollToBottom();
}

function scrollToBottom() {
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

// Ensure input stays focused when clicking the terminal
document.addEventListener('click', () => {
    input.focus();
});
