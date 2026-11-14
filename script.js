"use strict";

/*
 * Add your real details here.
 * Empty values keep the corresponding links hidden.
 */
const CONTACT = {
  email: "",
  linkedin: "",
};

/* Contact links */
function setupContactLinks() {
  const emailLink = document.getElementById("email-link");
  const linkedinLink = document.getElementById("linkedin-link");

  const email = CONTACT.email.trim();

  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    emailLink.href = `mailto:${email}`;
    emailLink.textContent = email;
    emailLink.hidden = false;
  }

  if (CONTACT.linkedin.trim()) {
    try {
      const url = new URL(CONTACT.linkedin);

      const isLinkedIn =
        url.hostname === "linkedin.com" ||
        url.hostname.endsWith(".linkedin.com");

      if (url.protocol === "https:" && isLinkedIn) {
        linkedinLink.href = url.href;
        linkedinLink.hidden = false;
      }
    } catch {
      // Leave the link hidden until a valid URL is supplied.
    }
  }
}

setupContactLinks();

document.getElementById("year").textContent =
  new Date().getFullYear();

/* Particle background */
(() => {
  const canvas = document.getElementById("particles");

  if (!canvas) return;

  const context = canvas.getContext("2d");

  // The website remains usable if canvas is unavailable.
  if (!context) return;

  const motionPreference = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  const SETTINGS = {
    cursorRadius: 120,
    maximumPush: 32,
    returnSpeed: 4,

    minimumSpeed: 3,
    maximumSpeed: 9,

    minimumOpacity: 0.14,
    maximumOpacity: 0.48,

    // A radius of 0.5–1 produces particles 1–2 CSS pixels wide.
    minimumRadius: 0.5,
    maximumRadius: 1,

    maximumPixelRatio: 2,
  };

  let width = 0;
  let height = 0;

  let particles = [];
  let animationFrame = null;
  let lastFrameTime = null;

  const pointer = {
    active: false,
    x: 0,
    y: 0,
  };

  function randomBetween(minimum, maximum) {
    return minimum + Math.random() * (maximum - minimum);
  }

  function clamp(value, minimum, maximum) {
    return Math.min(maximum, Math.max(minimum, value));
  }

  function getParticleCount() {
    const area = width * height;
    const isMobile = width < 700;

    if (isMobile) {
      return clamp(Math.round(area / 12500), 20, 48);
    }

    return clamp(Math.round(area / 10000), 80, 150);
  }

  function createParticle() {
    const angle = Math.random() * Math.PI * 2;

    const speed = randomBetween(
      SETTINGS.minimumSpeed,
      SETTINGS.maximumSpeed
    );

    return {
      // Natural drifting position.
      x: Math.random() * width,
      y: Math.random() * height,

      velocityX: Math.cos(angle) * speed,
      velocityY: Math.sin(angle) * speed,

      // Cursor interaction is an offset from the natural position.
      offsetX: 0,
      offsetY: 0,

      radius: randomBetween(
        SETTINGS.minimumRadius,
        SETTINGS.maximumRadius
      ),

      opacity: randomBetween(
        SETTINGS.minimumOpacity,
        SETTINGS.maximumOpacity
      ),

      // Used if the pointer is exactly over the particle.
      fallbackAngle: Math.random() * Math.PI * 2,
    };
  }

  function drawParticles() {
    context.clearRect(0, 0, width, height);
    context.fillStyle = "#fff";

    for (const particle of particles) {
      context.globalAlpha = particle.opacity;

      context.beginPath();
      context.arc(
        particle.x + particle.offsetX,
        particle.y + particle.offsetY,
        particle.radius,
        0,
        Math.PI * 2
      );
      context.fill();
    }

    context.globalAlpha = 1;
  }

  function resizeCanvas() {
    const previousWidth = width;
    const previousHeight = height;

    width = Math.max(1, window.innerWidth);
    height = Math.max(1, window.innerHeight);

    /*
     * Keep the bitmap sharp on high-DPI displays.
     * Capping DPR limits memory and drawing costs on very dense screens.
     */
    const pixelRatio = Math.min(
      window.devicePixelRatio || 1,
      SETTINGS.maximumPixelRatio
    );

    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);

    context.setTransform(
      pixelRatio, 0,
      0, pixelRatio,
      0, 0
    );

    // Preserve the existing composition through viewport changes.
    if (previousWidth > 0 && previousHeight > 0) {
      for (const particle of particles) {
        particle.x *= width / previousWidth;
        particle.y *= height / previousHeight;
      }
    }

    const desiredCount = getParticleCount();

    if (particles.length > desiredCount) {
      particles.length = desiredCount;
    }

    while (particles.length < desiredCount) {
      particles.push(createParticle());
    }

    drawParticles();
  }

  function updateParticles(deltaTime) {
    /*
     * Exponential easing behaves consistently at different frame rates.
     * Offsets gently return to zero when the cursor moves away.
     */
    const easing =
      1 - Math.exp(-SETTINGS.returnSpeed * deltaTime);

    const wrapPadding = SETTINGS.maximumPush + 4;

    for (const particle of particles) {
      particle.x += particle.velocityX * deltaTime;
      particle.y += particle.velocityY * deltaTime;

      // Wrap outside the screen so particles do not visibly pop at edges.
      if (particle.x < -wrapPadding) {
        particle.x = width + wrapPadding;
      } else if (particle.x > width + wrapPadding) {
        particle.x = -wrapPadding;
      }

      if (particle.y < -wrapPadding) {
        particle.y = height + wrapPadding;
      } else if (particle.y > height + wrapPadding) {
        particle.y = -wrapPadding;
      }

      let targetOffsetX = 0;
      let targetOffsetY = 0;

      if (pointer.active) {
        const differenceX = particle.x - pointer.x;
        const differenceY = particle.y - pointer.y;

        const distance = Math.hypot(
          differenceX,
          differenceY
        );

        if (distance < SETTINGS.cursorRadius) {
          const influence =
            1 - distance / SETTINGS.cursorRadius;

          const push =
            SETTINGS.maximumPush * influence * influence;

          const directionX =
            distance > 0
              ? differenceX / distance
              : Math.cos(particle.fallbackAngle);

          const directionY =
            distance > 0
              ? differenceY / distance
              : Math.sin(particle.fallbackAngle);

          targetOffsetX = directionX * push;
          targetOffsetY = directionY * push;
        }
      }

      particle.offsetX +=
        (targetOffsetX - particle.offsetX) * easing;

      particle.offsetY +=
        (targetOffsetY - particle.offsetY) * easing;
    }
  }

  function animate(timestamp) {
    animationFrame = null;

    if (document.hidden || motionPreference.matches) {
      lastFrameTime = null;
      return;
    }

    /*
     * Time-based movement keeps drift consistent across refresh rates.
     * Clamp long frames to avoid sudden jumps after interruptions.
     */
    const deltaTime =
      lastFrameTime === null
        ? 0
        : Math.min((timestamp - lastFrameTime) / 1000, 0.05);

    lastFrameTime = timestamp;

    updateParticles(deltaTime);
    drawParticles();

    animationFrame = window.requestAnimationFrame(animate);
  }

  function startAnimation() {
    if (
      animationFrame !== null ||
      document.hidden ||
      motionPreference.matches
    ) {
      return;
    }

    lastFrameTime = null;
    animationFrame = window.requestAnimationFrame(animate);
  }

  function stopAnimation() {
    if (animationFrame !== null) {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }

    lastFrameTime = null;
  }

  function clearPointer() {
    pointer.active = false;
  }

  window.addEventListener(
    "pointermove",
    (event) => {
      // Touch scrolling should not activate cursor interactions.
      if (
        motionPreference.matches ||
        event.pointerType === "touch"
      ) {
        return;
      }

      pointer.active = true;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    },
    { passive: true }
  );

  document.documentElement.addEventListener(
    "pointerleave",
    clearPointer
  );

  window.addEventListener("blur", clearPointer);

  window.addEventListener(
    "resize",
    resizeCanvas,
    { passive: true }
  );

  // Stop requesting frames while the tab is hidden.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      clearPointer();
      stopAnimation();
    } else {
      startAnimation();
    }
  });

  // Respond if the user changes their motion preference while browsing.
  motionPreference.addEventListener("change", () => {
    clearPointer();
    stopAnimation();

    for (const particle of particles) {
      particle.offsetX = 0;
      particle.offsetY = 0;
    }

    drawParticles();
    startAnimation();
  });

  resizeCanvas();
  startAnimation();
})();