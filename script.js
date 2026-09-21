console.log("script loaded");

const canvas = document.getElementById("rain");
const ctx = canvas.getContext("2d");

const TYPE_SPEED = 30;
const DELETE_SPEED = 15;
const READ_PAUSE = 2500;
const NEXT_GAP = 300;

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resize();
window.addEventListener("resize", resize);

const chars = ["0", "1", "const", "let", "if", "for", "=>", "{}", "();", "&&", "sudo", "0x", "int", "def", "==", "++"];
const fontSize = window.innerWidth < 600 ? 22 : 16;

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

const lines = [
    "whoami?",
    "student dev",
    "python | c++ | ml | cybersecurity",
    "codeforces grinder",
    "hack club member",
    "building things that run"
];

const typedEl = document.getElementById("typed");

let lineIndex = 0;
let charIndex = 0;
let deleting = false;

function type() {
    const full = lines[lineIndex];

    if (!deleting) {
        charIndex++;
        typedEl.textContent = full.slice(0, charIndex);

        if (charIndex === full.length) {
            deleting = true;
            setTimeout(type, READ_PAUSE);
            return;
        }
        setTimeout(type, TYPE_SPEED);
    } else {
        charIndex--;
        typedEl.textContent = full.slice(0, charIndex);

        if (charIndex === 0) {
            deleting = false;
            lineIndex = (lineIndex + 1) % lines.length;
            setTimeout(type, NEXT_GAP);
            return;
        }
        setTimeout(type, DELETE_SPEED);
    }
}

type();
