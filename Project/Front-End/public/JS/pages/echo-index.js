// public/js/echo-maze.js

document.addEventListener("DOMContentLoaded", () => {
  const mazeContainer = document.querySelector(".puzzle--echo-maze");
  const cells = document.querySelectorAll(".maze-cell");
  const statusEl = document.getElementById("maze-status");
  const clueEl = document.getElementById("maze-clue");
  const codeEl = document.getElementById("maze-code");
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

  if (!mazeContainer || !cells.length || !statusEl || !clueEl || !codeEl) {
    return;
  }
  // Correct knight path from 08 to 21 on a 5x5 grid:
  // reflection_0821 -> start at tile 08, exit at tile 21
  const correctPath = [8, 19, 12, 21];
  const noiseTokenTile = 12;

  let currentIndex = 0; // index into correctPath (we start ON 8)
  let glitchLevel = 0;
  let solved = false;
  let hasNoiseToken = false;
  let decayTimer = null;
  const decayMs = 6000;

  const cluesByStep = {
    1: "You jump sideways, then down. The Mirror flinches: it hates patterns it cannot draw as straight lines.",
    2: "Two tiles flicker: 08 and 21. reflection_0821 was never a case ID. It was a start and an exit burned into the grid.",
    3: "The final tile hums under your feet. All the wrong paths you almost took collapse into static."
  };

  function getCell(num) {
    return document.querySelector(`.maze-cell[data-cell="${num}"]`);
  }

  function isKnightMove(from, to) {
    const fromIdx = from - 1;
    const toIdx = to - 1;

    const fromRow = Math.floor(fromIdx / 5);
    const fromCol = fromIdx % 5;
    const toRow = Math.floor(toIdx / 5);
    const toCol = toIdx % 5;

    const dr = Math.abs(fromRow - toRow);
    const dc = Math.abs(fromCol - toCol);

    return (dr === 2 && dc === 1) || (dr === 1 && dc === 2);
  }

  function triggerGlitch(message) {
    glitchLevel = Math.min(glitchLevel + 1, 3);

    mazeContainer.classList.remove("glitch-1", "glitch-2", "glitch-3");
    if (glitchLevel > 0) {
      mazeContainer.classList.add(`glitch-${glitchLevel}`);
    }

    statusEl.innerHTML = message;
    if (window.MirrorEffects) {
      MirrorEffects.flashError(mazeContainer, "angry");
      MirrorEffects.scrambleText(statusEl, statusEl.textContent);
    }
  }

  function showClueForStep(stepIndex) {
    const text = cluesByStep[stepIndex];
    if (text) {
      clueEl.textContent = text;
    }
  }

  function resetDecayTimer() {
    clearTimeout(decayTimer);
    decayTimer = setTimeout(() => {
      if (solved || currentIndex === 0) return;
      const fromCell = getCell(correctPath[currentIndex]);
      currentIndex = Math.max(0, currentIndex - 1);
      const toCell = getCell(correctPath[currentIndex]);
      if (fromCell) fromCell.classList.remove("maze-cell--current");
      if (toCell) toCell.classList.add("maze-cell--current");
      statusEl.textContent = "Time decay: The path jittered backward.";
      if (window.MirrorEffects) {
        MirrorEffects.flashError(mazeContainer, "standard");
      }
    }, decayMs);
  }

  // mark start
  const startCell = getCell(correctPath[0]);
  if (startCell) startCell.classList.add("maze-cell--current");
  resetDecayTimer();

  cells.forEach((cell) => {
    cell.addEventListener("click", () => {
      if (solved) return;

      const target = Number(cell.dataset.cell);
      const current = correctPath[currentIndex];

      // Ignore clicking the tile you're already on
      if (target === current) {
        return;
      }

      const expectedNext = correctPath[currentIndex + 1];

      // First check: is this even a knight move?
      if (!isKnightMove(current, target)) {
        triggerGlitch(
          "Illegal move. The Mirror shreds paths that aren't shaped like a knight's jump."
        );
        return;
      }

      // Knight move, but not the correct path
      if (target !== expectedNext) {
        triggerGlitch(
          "Dead echo. You land on a tile that loops you back into noise."
        );
        return;
      }

      // Correct move
      const currentCell = getCell(current);
      if (currentCell) {
        currentCell.classList.remove("maze-cell--current");
      }
      cell.classList.add("maze-cell--current");

      currentIndex++;
      resetDecayTimer();

      if (target === noiseTokenTile) {
        hasNoiseToken = true;
        statusEl.textContent = "Noise token acquired. The grid hums differently.";
      }

      // If reaching exit without token, reset progress
      const isExit = target === correctPath[correctPath.length - 1];
      if (isExit && !hasNoiseToken) {
        statusEl.textContent = "You reached the exit without the noise token. The Mirror restarts you.";
        mazeContainer.classList.remove("glitch-1", "glitch-2", "glitch-3");
        hasNoiseToken = false;
        currentIndex = 0;
        cells.forEach((c) => c.classList.remove("maze-cell--current"));
        const restart = getCell(correctPath[0]);
        if (restart) restart.classList.add("maze-cell--current");
        if (window.MirrorEffects) {
          MirrorEffects.flashError(mazeContainer, "angry");
        }
        resetDecayTimer();
        return;
      }

      showClueForStep(currentIndex);

      if (currentIndex === correctPath.length - 1) {
        solved = true;
        mazeContainer.classList.remove("glitch-1", "glitch-2", "glitch-3");
        clearTimeout(decayTimer);

        statusEl.innerHTML =
          "Exit node located. For a moment, the feed loses track of you.";
        codeEl.classList.remove("is-hidden");
        postProgress({ flags: { solvedEcho: true }, codes: { echo: "ECHO-INDEX" } });
      }
    });
  });
});
