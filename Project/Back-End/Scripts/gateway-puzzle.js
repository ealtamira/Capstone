// === CONFIG ===
const hiddenWord = "TROLL".split(""); // The target word
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// === BUILD GRID ===
const grid = document.getElementById("puzzle-grid");
hiddenWord.forEach((_, i) => {
  const cell = document.createElement("div");
  cell.className = "puzzle-cell";

  const up = document.createElement("button");
  up.textContent = "▲";

  const letter = document.createElement("div");
  letter.textContent = alphabet[Math.floor(Math.random() * 26)];
  letter.className = "letter";

  const down = document.createElement("button");
  down.textContent = "▼";

  up.addEventListener("click", () => cycleLetter(letter, 1));
  down.addEventListener("click", () => cycleLetter(letter, -1));

  cell.appendChild(up);
  cell.appendChild(letter);
  cell.appendChild(down);
  grid.appendChild(cell);
});

function cycleLetter(letterEl, dir) {
  const current = letterEl.textContent;
  let index = alphabet.indexOf(current);
  index = (index + dir + alphabet.length) % alphabet.length;
  letterEl.textContent = alphabet[index];
  checkProgress();
}

// === CHECK FOR COMPLETION ===
function checkProgress() {
  const letters = [...document.querySelectorAll(".letter")].map(l => l.textContent);
  if (letters.join("") === hiddenWord.join("")) {
    document.getElementById("unlock-section").classList.remove("hidden");
  }
}

// === HANDLE SUBMISSION ===
document.getElementById("submit-btn").addEventListener("click", () => {
  const input = document.getElementById("puzzle-input").value.trim().toUpperCase();
  const feedback = document.getElementById("feedback");

  if (input === hiddenWord.join("")) {
    feedback.textContent = "Access Granted. Proceeding to Reflection...";
    feedback.style.color = "#0f0";
    setTimeout(() => {
      window.location.href = "/reflection";
    }, 1500);
  } else {
    feedback.textContent = "Incorrect. The Mirror sees through deception.";
    feedback.style.color = "#f00";
  }
});
