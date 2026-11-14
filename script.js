"use strict";

const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
);

// Small white particles behind the page.
(() => {
    const canvas = document.getElementById("particles");
    const ctx = canvas?.getContext("2d");

    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles = [];
    let frameId = null;
    let lastTime = null;

    const mouse = {
        x: 0,
        y: 0,
        active: false
    };

    const random = (min, max) =>
        min + Math.random() * (max - min);

    function makeParticle() {
        const angle = random(0, Math.PI * 2);
        const speed = random(3, 9);

        return {
            x: random(0, width),
            y: random(0, height),

            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,

            offsetX: 0,
            offsetY: 0,

            radius: random(0.5, 1),
            opacity: random(0.2, 0.65),

            angle
        };
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = "#ffffff";

        for (const p of particles) {
            ctx.globalAlpha = p.opacity;

            ctx.beginPath();

            ctx.arc(
                p.x + p.offsetX,
                p.y + p.offsetY,
                p.radius,
                0,
                Math.PI * 2
            );

            ctx.fill();
        }

        ctx.globalAlpha = 1;
    }

    function resize() {
        const oldWidth = width;
        const oldHeight = height;

        width = Math.max(1, window.innerWidth);
        height = Math.max(1, window.innerHeight);

        // Sharp rendering without excessive high-DPI drawing costs.
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        if (oldWidth && oldHeight) {
            for (const p of particles) {
                p.x *= width / oldWidth;
                p.y *= height / oldHeight;
            }
        }

        const mobile = width < 700;
        const count = Math.round(width * height / 11000);

        const target = Math.max(
            mobile ? 20 : 80,
            Math.min(mobile ? 50 : 150, count)
        );

        particles.length = Math.min(
            particles.length,
            target
        );

        while (particles.length < target) {
            particles.push(makeParticle());
        }

        draw();
    }

    function update(dt) {
        const easing = 1 - Math.exp(-4 * dt);

        for (const p of particles) {
            p.x += p.vx * dt;
            p.y += p.vy * dt;

            // Wrap outside the viewport.
            if (p.x < -40) p.x = width + 40;
            if (p.x > width + 40) p.x = -40;

            if (p.y < -40) p.y = height + 40;
            if (p.y > height + 40) p.y = -40;

            let pushX = 0;
            let pushY = 0;

            if (mouse.active) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;

                const distance = Math.hypot(dx, dy);

                if (distance < 120) {
                    const force =
                        28 * (1 - distance / 120) ** 2;

                    const directionX = distance
                        ? dx / distance
                        : Math.cos(p.angle);

                    const directionY = distance
                        ? dy / distance
                        : Math.sin(p.angle);

                    pushX = directionX * force;
                    pushY = directionY * force;
                }
            }

            // Ease back to natural drift when the cursor moves away.
            p.offsetX += (pushX - p.offsetX) * easing;
            p.offsetY += (pushY - p.offsetY) * easing;
        }
    }

    function animate(now) {
        frameId = null;

        if (document.hidden || reducedMotion.matches) {
            lastTime = null;
            return;
        }

        const dt = lastTime === null
            ? 0
            : Math.min((now - lastTime) / 1000, 0.05);

        lastTime = now;

        update(dt);
        draw();

        frameId = requestAnimationFrame(animate);
    }

    function syncAnimation() {
        if (frameId !== null) {
            cancelAnimationFrame(frameId);
        }

        frameId = null;
        lastTime = null;
        mouse.active = false;

        if (reducedMotion.matches) {
            for (const p of particles) {
                p.offsetX = 0;
                p.offsetY = 0;
            }

            draw();
        } else if (!document.hidden) {
            frameId = requestAnimationFrame(animate);
        }
    }

    window.addEventListener(
        "pointermove",
        (event) => {
            if (
                reducedMotion.matches ||
                event.pointerType === "touch"
            ) {
                return;
            }

            mouse.x = event.clientX;
            mouse.y = event.clientY;
            mouse.active = true;
        },
        { passive: true }
    );

    const clearMouse = () => {
        mouse.active = false;
    };

    document.documentElement.addEventListener(
        "pointerleave",
        clearMouse
    );

    window.addEventListener("blur", clearMouse);

    window.addEventListener(
        "resize",
        resize,
        { passive: true }
    );

    document.addEventListener(
        "visibilitychange",
        syncAnimation
    );

    reducedMotion.addEventListener(
        "change",
        syncAnimation
    );

    resize();
    syncAnimation();
})();

// Keep the existing typing text below your name.
(() => {
    const typedEl = document.getElementById("typed");

    if (!typedEl) return;

    const lines = [
        "whoami?",
        "student dev",
        "techie",
        "python | c++ | ml | cybersecurity",
        "codeforces grinder",
        "hack club member",
        "building things that run"
    ];

    let lineIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timer = null;

    function type() {
        if (document.hidden || reducedMotion.matches) {
            return;
        }

        const full = lines[lineIndex];

        charIndex += deleting ? -1 : 1;
        typedEl.textContent = full.slice(0, charIndex);

        let delay = deleting ? 15 : 30;

        if (!deleting && charIndex === full.length) {
            deleting = true;
            delay = 2500;
        } else if (deleting && charIndex === 0) {
            deleting = false;
            lineIndex = (lineIndex + 1) % lines.length;
            delay = 300;
        }

        timer = setTimeout(type, delay);
    }

    function syncTyping() {
        clearTimeout(timer);

        if (reducedMotion.matches) {
            typedEl.textContent = "student dev";
        } else if (!document.hidden) {
            typedEl.textContent =
                lines[lineIndex].slice(0, charIndex);

            timer = setTimeout(type, 30);
        }
    }

    document.addEventListener(
        "visibilitychange",
        syncTyping
    );

    reducedMotion.addEventListener(
        "change",
        syncTyping
    );

    syncTyping();
})();