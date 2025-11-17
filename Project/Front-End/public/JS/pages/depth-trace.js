// public/js/depth-trace.js

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".puzzle--depth-trace");
  const cards = document.querySelectorAll(".trace-card");
  const submitBtn = document.getElementById("trace-submit");
  const resultEl = document.getElementById("trace-result");
  const statusEl = document.getElementById("trace-status");
  const codeEl = document.getElementById("trace-code");

  if (!container || !cards.length || !submitBtn || !resultEl || !statusEl || !codeEl) {
    return;
  }

  let glitchLevel = 0;
  let solved = false;

  // The Mirror's preferred classification:
  // t1: KEEP  (guilt + self-blame + high engagement)
  // t2: DISCARD (offline, distrust)
  // t3: KEEP  (public apology + compliance)
  // t4: DISCARD (system criticism)
  // t5: KEEP  (shame + passive consumption)
  // t6: DISCARD (no public data)
  const correctMap = {
    t1: "KEEP",
    t2: "DISCARD",
    t3: "KEEP",
    t4: "DISCARD",
    t5: "KEEP",
    t6: "DISCARD",
  };

  function applyGlitch() {
    glitchLevel = Math.min(glitchLevel + 1, 3);
    container.classList.remove("glitch-1", "glitch-2", "glitch-3");
    if (glitchLevel > 0) {
      container.classList.add(`glitch-${glitchLevel}`);
    }
  }

  submitBtn.addEventListener("click", () => {
    if (solved) return;

    let missing = 0;
    let mistakes = 0;

    cards.forEach((card) => {
      const id = card.dataset.id;
      const select = card.querySelector(".trace-select");
      if (!select) return;

      const value = select.value;
      if (!value) {
        missing++;
        return;
      }

      if (value !== correctMap[id]) {
        mistakes++;
      }
    });

    if (missing > 0) {
      resultEl.textContent =
        "Depth trace incomplete. Some memories are still unclassified.";
      resultEl.classList.remove("algorithm-result--success");
      resultEl.classList.add("algorithm-result--error");
      codeEl.classList.add("is-hidden");
      return;
    }

    if (mistakes > 0) {
      applyGlitch();
      resultEl.textContent =
        `Classification mismatch. The Mirror rejects ${mistakes} of your labels and rewrites the archive.`;
      resultEl.classList.remove("algorithm-result--success");
      resultEl.classList.add("algorithm-result--error");
      codeEl.classList.add("is-hidden");

      statusEl.textContent =
        "With each wrong guess, the traces distort—less like memories, more like scripts it wishes you had followed.";
      return;
    }

    // Success
    solved = true;
    container.classList.remove("glitch-1", "glitch-2", "glitch-3");

    resultEl.textContent =
      "Depth trace stabilized. You are seeing the version of yourself The Mirror actually wants to keep.";
    resultEl.classList.remove("algorithm-result--error");
    resultEl.classList.add("algorithm-result--success");

    statusEl.textContent =
      "It keeps the guilt, the performance, the silent scrolling. It deletes the parts of you that walk away.";

    codeEl.classList.remove("is-hidden");
  });
});
