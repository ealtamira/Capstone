// public/js/echo-maze.js

document.addEventListener("DOMContentLoaded", () => {
  const mazeContainer = document.querySelector(".puzzle--echo-maze");
  const cells = document.querySelectorAll(".maze-cell");
  const statusEl = document.getElementById("maze-status");
  const clueEl = document.getElementById("maze-clue");
  const codeEl = document.getElementById("maze-code");

  if (!mazeContainer || !cells.length || !statusEl || !clueEl || !codeEl) {
    return;
  }
  // Correct knight path from 08 to 21 on a 5x5 grid:
  // reflection_0821 -> start at tile 08, exit at tile 21
  const correctPath = [8, 19, 12, 21];

  let currentIndex = 0; // index into correctPath (we start ON 8)
  let glitchLevel = 0;
  let solved = false;

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
  }

  function showClueForStep(stepIndex) {
    const text = cluesByStep[stepIndex];
    if (text) {
      clueEl.textContent = text;
    }
  }

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
          "Illegal move. The Mirror shreds paths that aren’t shaped like a knight’s jump."
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
      showClueForStep(currentIndex);

      if (currentIndex === correctPath.length - 1) {
        solved = true;
        mazeContainer.classList.remove("glitch-1", "glitch-2", "glitch-3");

        statusEl.innerHTML =
          "Exit node located. For a moment, the feed loses track of you.";
        codeEl.classList.remove("is-hidden");
      }
    });
  });
});
