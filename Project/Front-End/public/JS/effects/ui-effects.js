// Shared immersive UI effects
(function () {
  const doc = document;

  function addHUD() {
    if (doc.getElementById("mirror-hud")) return;
    const hud = doc.createElement("div");
    hud.id = "mirror-hud";
    hud.innerHTML = `
      <div class="hud-pill"><span class="dot"></span><span data-hud="status">Signal Stable</span></div>
      <div class="hud-pill hud-danger"><span class="dot"></span><span data-hud="compliance">Compliance: 96%</span></div>
    `;
    doc.body.appendChild(hud);
  }

  function updateHUD(statusText, compliance) {
    const statusEl = doc.querySelector('[data-hud="status"]');
    const compEl = doc.querySelector('[data-hud="compliance"]');
    if (statusEl && statusText) statusEl.textContent = statusText;
    if (compEl && compliance) compEl.textContent = `Compliance: ${compliance}%`;
  }

  function addCommandPalette() {
    if (doc.querySelector(".command-palette")) return;
    const palette = doc.createElement("div");
    palette.className = "command-palette";
    palette.innerHTML = `
      <h4>Mirror Commands</h4>
      <ul>
        <li>~ : Toggle Console</li>
        <li>CTRL + K : Quick Actions</li>
        <li>CTRL + L : System Logs</li>
        <li>CTRL + M : Disturbance Pulse</li>
      </ul>
    `;
    doc.body.appendChild(palette);
  }

  function togglePalette() {
    const palette = doc.querySelector(".command-palette");
    if (!palette) return;
    palette.classList.toggle("is-open");
  }

  function addCursorTrail() {
    const pool = [];
    const poolSize = 14;

    for (let i = 0; i < poolSize; i++) {
      const dot = doc.createElement("div");
      dot.className = "cursor-trail";
      doc.body.appendChild(dot);
      pool.push(dot);
    }

    let index = 0;
    doc.addEventListener("pointermove", e => {
      const dot = pool[index++ % poolSize];
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
      dot.classList.add("active");
      setTimeout(() => dot.classList.remove("active"), 300);
    });
  }

  function addDataRainLayer() {
    if (doc.getElementById("data-rain")) return;
    const rain = doc.createElement("div");
    rain.id = "data-rain";
    doc.body.appendChild(rain);
  }

  function triggerDataRain() {
    const rain = doc.getElementById("data-rain");
    if (!rain) return;
    rain.classList.add("active");
    setTimeout(() => rain.classList.remove("active"), 1200);
  }

  function enableAmbientPulse() {
    doc.body.classList.add("ambient-pulse");
  }

  function enableParallax() {
    doc.body.classList.add("tilted");
    doc.addEventListener("pointermove", e => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 4;
      const y = (e.clientY / innerHeight - 0.5) * -4;
      doc.documentElement.style.setProperty("--tiltX", `${x}deg`);
      doc.documentElement.style.setProperty("--tiltY", `${y}deg`);
    });
  }

  function wireShortcuts() {
    doc.addEventListener("keydown", e => {
      if (e.ctrlKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        togglePalette();
      }
      if (e.ctrlKey && e.key.toLowerCase() === "l") {
        console.log("%c[Mirror Logs]", "color:#00ffff", new Date().toISOString());
      }
      if (e.ctrlKey && e.key.toLowerCase() === "m") {
        if (typeof window.triggerMirrorDisturbance === "function") {
          window.triggerMirrorDisturbance("angry");
        }
      }
      if (e.key === "~") {
        togglePalette();
      }
    });
  }

  window.MirrorUI = {
    addHUD,
    updateHUD,
    addCommandPalette,
    addCursorTrail,
    addDataRainLayer,
    triggerDataRain,
    enableAmbientPulse,
    enableParallax,
    wireShortcuts
  };
})();
