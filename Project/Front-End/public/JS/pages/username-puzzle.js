// Enhanced username puzzle: reverse + Caesar + Vigenère hint

const correctUsername = "MIRRORHASYOU";
const encodedMessage = "FollowDeeperInTheWeb";
// encodedUsername: reverse(Vigenere+Caesar)
const encodedUsername = "QHUONYNHNNVD";
const vigenereKey = "MIRROR";

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

// === helpers ===
const mainEl = document.querySelector("main");
document.getElementById("encoded-message").textContent = encodedMessage;

function caesarDecode(text, shift = 5) {
  return text
    .split("")
    .map((ch) => {
      const code = ch.charCodeAt(0);
      if (ch >= "A" && ch <= "Z") {
        return String.fromCharCode(((code - 65 - shift + 26) % 26) + 65);
      } else if (ch >= "a" && ch <= "z") {
        return String.fromCharCode(((code - 97 - shift + 26) % 26) + 97);
      }
      return ch;
    })
    .join("");
}

function vigenereDecode(text, key) {
  const k = key.toUpperCase();
  let ki = 0;
  return text
    .split("")
    .map((ch) => {
      const code = ch.charCodeAt(0);
      if (ch >= "A" && ch <= "Z") {
        const shift = k.charCodeAt(ki % k.length) - 65;
        ki++;
        return String.fromCharCode(((code - 65 - shift + 26) % 26) + 65);
      } else if (ch >= "a" && ch <= "z") {
        const shift = k.charCodeAt(ki % k.length) - 65;
        ki++;
        return String.fromCharCode(((code - 97 - shift + 26) % 26) + 97);
      }
      return ch;
    })
    .join("");
}

// pull shift from subtle data attribute
const shiftNotice = document.querySelector(".subtle[data-shift]");
const shift = shiftNotice ? parseInt(shiftNotice.dataset.shift, 10) || 5 : 5;

// double-layer decode: reverse, Caesar, then Vigenère
function decodeUsername() {
  const reversed = encodedUsername.split("").reverse().join("");
  const caesar = caesarDecode(reversed, shift);
  const final = vigenereDecode(caesar, vigenereKey);
  return final.toUpperCase();
}

// build interaction
const inputField = document.createElement("input");
inputField.placeholder = "Enter decoded username...";
inputField.id = "user-input";
inputField.className = "input-field";
mainEl.appendChild(inputField);

const submitBtn = document.createElement("button");
submitBtn.textContent = "Verify";
submitBtn.className = "cta-button";
mainEl.appendChild(submitBtn);

const status = document.createElement("p");
status.id = "status";
mainEl.appendChild(status);

// set hint in source
console.log("%c[MIRROR_LOG]", "color:#00ffff; font-weight:bold;");
console.log("%cHint: reverse first, then shift by data-shift, then key=MIRROR.", "color:#ff00ff;");
console.log("%cPsst... look for polite notices.", "color:#888; font-style:italic;");

submitBtn.addEventListener("click", () => {
  const attempt = inputField.value.trim().toUpperCase();
  const decoded = decodeUsername();

  if (attempt === decoded) {
    document.getElementById("unlock-section").classList.remove("hidden");
    document.getElementById("username-output").value = decoded;
    status.textContent = "Reflection accepted. Username retrieved.";
    status.style.color = "#00ff88";
    postProgress({ flags: { solvedUsername: true } });
  } else {
    status.textContent = "The mirror rejects your reflection.";
    status.style.color = "#ff0044";
    if (window.MirrorEffects) {
      MirrorEffects.flashError(mainEl, "angry");
      MirrorEffects.scrambleText(status, status.textContent);
    }
  }
});

// copy action
document.getElementById("copy-btn").addEventListener("click", () => {
  const input = document.getElementById("username-output");
  input.select();
  document.execCommand("copy");
  setTimeout(() => {
    window.location.href = "/appeal";
  }, 1000);
});
