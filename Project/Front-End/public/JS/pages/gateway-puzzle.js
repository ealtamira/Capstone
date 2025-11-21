/* ==============================
   GATEWAY PUZZLE — ALIGNMENT PROTOCOL (CHECK-BUTTON VERSION)
   ============================== */

if (document.getElementById("puzzle-grid")) {
  console.log("%c[MIRROR_LOG] Gateway Puzzle Online", "color:#00ffff; font-weight:bold;");

  // === CONFIG ===
  const TARGET_WORD = "TROLL";
  const hiddenWord = TARGET_WORD.split("");

  // Smaller alphabet for better UX
  const alphabet = ["T","R","O","L","S","E","A","N","C","I","M"];

  let solved = false;

  // DOM refs
  const grid = document.getElementById("puzzle-grid");
  const unlockSection = document.getElementById("unlock-section");
  const checkBtn = document.getElementById("align-check-btn");
  const input = document.getElementById("puzzle-input");
  const submitBtn = document.getElementById("submit-btn");
  const feedback = document.getElementById("feedback");

  const cells = [];

  /* ==============================
     BUILD GRID
     ============================== */
  hiddenWord.forEach(() => {
    const cell = document.createElement("div");
    cell.className = "puzzle-cell";

    const up = document.createElement("button");
    up.textContent = "▲";
    up.setAttribute("aria-label", "Increase letter");

    const letter = document.createElement("div");
    letter.textContent = alphabet[Math.floor(Math.random() * alphabet.length)];
    letter.className = "letter";

    const down = document.createElement("button");
    down.textContent = "▼";
    down.setAttribute("aria-label", "Decrease letter");

    up.addEventListener("click", () => cycleLetter(letter, 1));
    down.addEventListener("click", () => cycleLetter(letter, -1));

    cell.appendChild(up);
    cell.appendChild(letter);
    cell.appendChild(down);
    grid.appendChild(cell);

    cells.push({ cell, letter });
  });

  function cycleLetter(letterEl, dir) {
    if (solved) return;

    const index = alphabet.indexOf(letterEl.textContent);
    const next = (index + dir + alphabet.length) % alphabet.length;
    letterEl.textContent = alphabet[next];
  }

  /* ==============================
     CHECK ALIGNMENT (on button press)
     ============================== */
  function checkAlignment() {
    if (solved) return;

    const letters = cells.map(({ letter }) => letter.textContent);
    const current = letters.join("");

    console.log("[Gateway] Current sequence:", current);

    if (current === hiddenWord.join("")) {
      solved = true;
      console.log("%c[MIRROR_LOG] Alignment Achieved. Reflection stabilized.", "color:#0f0; font-weight:bold;");

      unlockSection.classList.remove("hidden");
      feedback.textContent = "Sequence aligned. The Mirror allows you to proceed.";
      feedback.style.color = "#00ff88";

      // Soft hint: show the expected phrase in the placeholder
      if (input && !input.value) {
        input.placeholder = TARGET_WORD;
      }
    } else {
      feedback.textContent = "Alignment incomplete. Recalibrate your reflection.";
      feedback.style.color = "#ff4444";

      // Little shake effect for fun
      grid.classList.add("shake");
      setTimeout(() => grid.classList.remove("shake"), 300);
      if (window.MirrorEffects) {
        MirrorEffects.flashError(grid, "angry");
        MirrorEffects.scrambleText(feedback, feedback.textContent);
      }
    }
  }

  if (checkBtn) {
    checkBtn.addEventListener("click", checkAlignment);
  }

  /* ==============================
     SUBMIT PHRASE
     ============================== */
  submitBtn.addEventListener("click", () => {
    const value = (input.value || "").trim().toUpperCase();

    if (value === TARGET_WORD) {
      feedback.textContent = "Access Granted. Proceeding to Reflection...";
      feedback.style.color = "#0f0";
      setTimeout(() => {
        window.location.href = "/reflection";
      }, 1200);
    } else {
      feedback.textContent = "The phrase does not match your alignment.";
      feedback.style.color = "#ff4444";

      grid.classList.add("shake");
      setTimeout(() => grid.classList.remove("shake"), 300);
      if (window.MirrorEffects) {
        MirrorEffects.flashError(grid, "angry");
        MirrorEffects.scrambleText(feedback, feedback.textContent);
      }
    }
  });
}
