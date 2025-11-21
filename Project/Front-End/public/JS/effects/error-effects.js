// Error-focused glitch helpers for puzzles
(function () {
  const doc = document;
  const GLYPHS = ["█", "▓", "▒", "░", "#", "%", "&", "@", "?", "/"];

  function retrigger(el, cls) {
    el.classList.remove(cls);
    // force reflow to restart animation
    // eslint-disable-next-line no-unused-expressions
    el.offsetHeight;
    el.classList.add(cls);
  }

  function flashError(target, mood = "standard") {
    if (!target) return;
    const cls = mood === "angry" ? "error-glitch-strong" : "error-glitch";
    retrigger(target, cls);

    if (window.MirrorUI?.triggerDataRain) {
      window.MirrorUI.triggerDataRain();
    }
    if (window.MirrorCompliance) {
      window.MirrorCompliance.adjustCompliance(mood === "angry" ? -2 : -1);
    }
    if (mood === "angry" && typeof window.triggerMirrorDisturbance === "function") {
      window.triggerMirrorDisturbance("angry");
    }
  }

  function scrambleText(el, finalText, duration = 900) {
    if (!el) return;
    const original = finalText ?? el.textContent;
    const chars = original.split("");
    let frame = 0;
    const frames = Math.max(12, Math.floor(duration / 30));

    const timer = setInterval(() => {
      const glitched = chars
        .map((ch) => (Math.random() < 0.32 && frame < frames * 0.75 ? GLYPHS[Math.floor(Math.random() * GLYPHS.length)] : ch))
        .join("");
      el.textContent = glitched;
      frame++;
      if (frame >= frames) {
        clearInterval(timer);
        el.textContent = original;
      }
    }, 30);
  }

  function shake(el) {
    if (!el) return;
    retrigger(el, "shake");
  }

  window.MirrorEffects = {
    flashError,
    scrambleText,
    shake,
  };
})();
