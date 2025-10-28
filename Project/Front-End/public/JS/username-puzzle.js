// === CONFIG ===
const correctUsername = "EricISeeYou";
const encodedMessage = "FollowDeeperInTheWeb";
const encodedUsername = "JwnhNXjjDtz"; // Caesar Cipher (+5 shift of "EricISeeYou")

// === SETUP ===
document.getElementById("encoded-message").textContent = encodedMessage;

// 🧩 Developer console hints
console.log("%c[MIRROR_LOG]", "color:#00ffff; font-weight:bold;");
console.log("%cHint: The reflection shifts by 5. Backward.", "color:#ff00ff;");
console.log("%cPsst... look deeper into the page source.", "color:#888; font-style:italic;");


// === CAESAR DECODER ===
function caesarDecode(text, shift = 5) {
  return text
    .split("")
    .map(ch => {
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

// === BUILD INTERACTIVE INPUT ===
const inputField = document.createElement("input");
inputField.placeholder = "Enter decoded username...";
inputField.id = "user-input";
inputField.className = "input-field";
document.querySelector("main").appendChild(inputField);

const submitBtn = document.createElement("button");
submitBtn.textContent = "Verify";
submitBtn.className = "cta-button";
document.querySelector("main").appendChild(submitBtn);

const status = document.createElement("p");
status.id = "status";
document.querySelector("main").appendChild(status);

// === VERIFY ATTEMPT ===
submitBtn.addEventListener("click", () => {
  const attempt = inputField.value.trim();
  const decoded = caesarDecode(encodedUsername, 5);

  if (attempt === decoded) {
    document.getElementById("unlock-section").classList.remove("hidden");
    document.getElementById("username-output").value = decoded;
    status.textContent = "Reflection accepted. Username retrieved.";
    status.style.color = "#00ff88";
  } else {
    status.textContent = "The mirror rejects your reflection.";
    status.style.color = "#ff0044";
  }
});

// === COPY FUNCTION ===
document.getElementById("copy-btn").addEventListener("click", () => {
  const input = document.getElementById("username-output");
  input.select();
  document.execCommand("copy");
  alert("Username copied to clipboard!");
  
  setTimeout(() => {
    window.location.href = "/appeal.html";
  }, 1000);
});
