console.log("script loaded");

const canvas = document.getElementById("rain");
const ctx = canvas.getContext("2d");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resize();
window.addEventListener("resize", resize);

const chars = ["0", "1", "const", "let", "if", "for", "=>", "{}", "();", "&&", "sudo", "0x", "int", "def", "==", "++"];
const fontSize = 16;

let columns = Math.floor(canvas.width / fontSize);
let drops = [];

for (let i = 0; i < columns; i++) {
    drops[i] = Math.random() * -50;
}

function draw() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.09)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#00ff41";
    ctx.font = fontSize + "px 'Space Grotesk', monospace";

    for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

setInterval(draw, 33);
