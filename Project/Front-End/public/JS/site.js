/* ==============================
   THE MIRROR INITIATIVE — JS
   ============================== */

// 🪞 Boot message
console.log("%c[Mirror Log]", "color:#00ffff; font-weight:bold; font-size:14px;");
console.log("%cTrace complete. Reflection ID located: user_0821", "color:#ff00ff; font-size:13px;");
console.log("%cRemember: The system is watching back.", "color:#ff0000; font-size:13px;");

// ===== GLITCH EFFECT =====
function applyGlitchEffect() {
  const glitchElements = document.querySelectorAll('.glitch');
  if (!glitchElements.length) return;

  const glitchChars = ['▓', '░', '▒', '#', '%', '&', '$', '@', '█'];

  function randomGlitch(el) {
    const original = el.getAttribute('data-text');
    if (!original) return;

    const chars = original.split('');
    const glitched = chars.map(ch => 
      Math.random() < 0.1 
        ? glitchChars[Math.floor(Math.random() * glitchChars.length)] 
        : ch
    ).join('');

    el.textContent = glitched;

    setTimeout(() => (el.textContent = original), 120);
  }

  setInterval(() => {
    glitchElements.forEach(el => {
      if (Math.random() < 0.25) randomGlitch(el);
    });
  }, 2200);
}

applyGlitchEffect();

// ===== SCREEN FLICKER EFFECT =====

function applyScreenFlicker() {
  function flicker() {
    document.body.style.opacity = Math.random() * 0.8 + 0.2;
    setTimeout(() => (document.body.style.opacity = 1), 90);
  }

  setInterval(() => {
    if (Math.random() < 0.04) flicker();
  }, 3000);
}

applyScreenFlicker();

// ===== HIDDEN INTERACTION =====

document.addEventListener('keydown', e => {
  if (e.key.toLowerCase() === 'r') {
    console.log("%c[Mirror Response]", "color:#00ffff; font-weight:bold;");
    console.log("%cReflection recalibrated. Maintain emotional stability.", "color:#00ffcc;");
  }
});

// =====  SECRET SYSTEM LOG MESSAGE =====

setTimeout(() => {
  console.log("%cSystem Notice:", "color:#999;");
  console.log("%cYour empathy levels have been synchronized.", "color:#00ffff;");
  console.log("%cDeviation detected: 0.3%. Within acceptable range.", "color:#ff00ff;");
}, 6000);;

// ===== MIRROR DISTURBANCE (Glitch + Watching Eye) =====

(() => {
  let overlay;
  let eye;
  let lastTrigger = 0;

  function ensureElements() {
    if (overlay && eye) return;

    overlay = document.createElement("div");
    overlay.id = "mirror-disturbance";
    overlay.innerHTML = `
      <div class="glitch-overlay"></div>
      <div class="mirror-eye" aria-hidden="true">
        <div class="eye-ring"></div>
        <div class="eye-iris"></div>
        <div class="eye-pupil"></div>
        <div class="eye-glare"></div>
      </div>
    `;
    document.body.appendChild(overlay);
    eye = overlay.querySelector(".mirror-eye");
  }

  function triggerMirrorDisturbance() {
    const now = Date.now();
    if (now - lastTrigger < 600) return; // throttle rapid spam
    lastTrigger = now;

    ensureElements();
    document.body.classList.add("mirror-disturbance");
    overlay.classList.add("is-active");

    setTimeout(() => {
      overlay && overlay.classList.remove("is-active");
      document.body.classList.remove("mirror-disturbance");
    }, 1400);
  }

  window.triggerMirrorDisturbance = triggerMirrorDisturbance;
})();

// ===== LOADING SCREEN =====

window.addEventListener("load", () => {
  const loader = document.getElementById("loading-screen");
  if (!loader) return;

  const delay = 1500 + Math.random() * 1500;

  setTimeout(() => {
    loader.classList.add("fade-out");
    setTimeout(() => loader.remove(), 800);
  }, delay);
});

// ===== MICROTEXT HIDDEN LINK =====

document.addEventListener("DOMContentLoaded", () => {
  const microText = document.querySelector('.microtextclickable');
  if (!microText) return;

  microText.addEventListener('click', () => {
    window.location.href = '/gateway-puzzle';
  });
});

