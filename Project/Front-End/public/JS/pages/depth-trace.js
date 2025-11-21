// public/js/depth-trace.js

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".puzzle--depth-trace");
  const grid = document.querySelector(".trace-grid");
  const cards = Array.from(document.querySelectorAll(".trace-card"));
  const resultEl = document.getElementById("trace-result");
  const statusEl = document.getElementById("trace-status");
  const codeEl = document.getElementById("trace-code");
  async function postProgress(payload) {
    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.warn("Progress update failed", err);
    }
  }

  if (!container || !grid || !cards.length || !resultEl || !statusEl || !codeEl) return;

  let glitchLevel = 0;
  let solved = false;
  let wrongLocks = 0;

  // The Mirror's preferred classification:
  const correctMap = {
    t1: "KEEP",
    t2: "DISCARD",
    t3: "KEEP",
    t4: "DISCARD",
    t5: "KEEP",
    t6: "DISCARD",
  };

  // Shuffle cards each load
  const shuffled = cards.sort(() => Math.random() - 0.5);
  grid.innerHTML = "";
  shuffled.forEach((card) => grid.appendChild(card));

  function applyGlitch() {
    glitchLevel = Math.min(glitchLevel + 1, 3);
    container.classList.remove("glitch-1", "glitch-2", "glitch-3");
    if (glitchLevel > 0) container.classList.add(`glitch-${glitchLevel}`);
  }

  function resetCorruption() {
    wrongLocks = 0;
    cards.forEach((card) => {
      card.classList.remove("trace-card--safe", "trace-card--corrupt", "is-locked");
      const select = card.querySelector(".trace-select");
      if (select) {
        select.disabled = false;
        select.value = "";
        select.classList.remove("is-valid", "is-invalid");
      }
    });
    resultEl.textContent = "Trace corrupted. Enter recovery code from Echo Labyrinth and retry.";
    resultEl.classList.add("algorithm-result--error");
    codeEl.classList.add("is-hidden");
    if (window.MirrorEffects) {
      MirrorEffects.flashError(container, "angry");
      MirrorEffects.scrambleText(resultEl, resultEl.textContent);
    }
  }

  function checkSolved() {
    const allLocked = cards.every((c) => c.classList.contains("is-locked"));
    const allValid = cards.every((c) => c.querySelector(".trace-select")?.classList.contains("is-valid"));
    if (allLocked && allValid) {
      solved = true;
      container.classList.remove("glitch-1", "glitch-2", "glitch-3");
      resultEl.textContent = "Depth trace stabilized. You are seeing the version of yourself The Mirror actually wants to keep.";
      resultEl.classList.remove("algorithm-result--error");
      resultEl.classList.add("algorithm-result--success");
      statusEl.textContent =
        "It keeps the guilt, the performance, the silent scrolling. It deletes the parts of you that walk away.";
      codeEl.classList.remove("is-hidden");
      postProgress({
        flags: { solvedDepth: true },
        codes: { depth: "DEPTH-TRACE", root: "ROOT-CHOICE" },
      });
      if (window.MirrorUI?.showToast) {
        window.MirrorUI.showToast("Trace secured.", "info");
      }
    }
  }

  cards.forEach((card) => {
    const select = card.querySelector(".trace-select");
    if (!select) return;

    select.addEventListener("change", () => {
      if (solved) return;
      resultEl.textContent = "";
      resultEl.classList.remove("algorithm-result--error", "algorithm-result--success");
      codeEl.classList.add("is-hidden");

      const id = card.dataset.id;
      const expected = correctMap[id];
      const value = select.value;

      if (!value) return;

      card.classList.add("is-locked");
      select.disabled = true;

      if (value === expected) {
        select.classList.remove("is-invalid");
        select.classList.add("is-valid");
        card.classList.add("trace-card--safe");
        if (window.MirrorUI?.showToast) {
          window.MirrorUI.showToast("Trace locked: entropy acceptable.", "info");
        }
      } else {
        wrongLocks += 1;
        select.classList.remove("is-valid");
        select.classList.add("is-invalid");
        card.classList.add("trace-card--corrupt");
        applyGlitch();
        resultEl.textContent = "Classification mismatch. The Mirror rejects your label.";
        resultEl.classList.add("algorithm-result--error");
        if (window.MirrorEffects) {
          MirrorEffects.flashError(card, wrongLocks >= 2 ? "angry" : "standard");
        }
        if (wrongLocks >= 2) {
          resetCorruption();
          return;
        }
      }

      checkSolved();
    });
  });
});
