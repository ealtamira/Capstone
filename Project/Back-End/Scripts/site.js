/* ==============================
   THE MIRROR INITIATIVE — JS
   ============================== */

// 🪞 Boot message
console.log("%c[Mirror Log]", "color:#00ffff; font-weight:bold; font-size:14px;");
console.log("%cTrace complete. Reflection ID located: user_0821", "color:#ff00ff; font-size:13px;");
console.log("%cRemember: The system is watching back.", "color:#ff0000; font-size:13px;");

// ===== GLITCH EFFECT =====
const glitchText = document.querySelector('.glitch');
const glitchChars = ['▓', '░', '▒', '#', '%', '&', '$', '@', '█'];

function randomGlitch() {
  if (!glitchText) return;
  const original = glitchText.getAttribute('data-text');
  const chars = original.split('');
  const newText = chars
    .map(ch => (Math.random() < 0.1 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : ch))
    .join('');
  glitchText.textContent = newText;

  // Restore text after a short delay
  setTimeout(() => {
    glitchText.textContent = original;
  }, 120);
}

// Trigger random glitch bursts
setInterval(() => {
  if (Math.random() < 0.3) randomGlitch();
}, 2500);

// ===== SCREEN FLICKER EFFECT =====
function flickerScreen() {
  document.body.style.opacity = Math.random() * 0.9 + 0.1;
  setTimeout(() => (document.body.style.opacity = 1), 80);
}

setInterval(() => {
  if (Math.random() < 0.05) flickerScreen();
}, 3000);

// ===== HIDDEN INTERACTION =====
document.addEventListener('keydown', e => {
  if (e.key.toLowerCase() === 'r') {
    console.log("%c[Mirror Response]", "color:#00ffff; font-weight:bold;");
    console.log("%cReflection recalibrated. Maintain emotional stability.", "color:#00ffcc;");
  }
});

// ===== SECRET MESSAGE =====
setTimeout(() => {
  console.log("%cSystem Notice:", "color:#999;");
  console.log("%cYour empathy levels have been synchronized.", "color:#00ffff;");
  console.log("%cDeviation detected: 0.3%. Within acceptable range.", "color:#ff00ff;");
}, 6000);

// The Mirror Portal - Loading Segment
window.addEventListener("load", () => {
  const loader = document.getElementById("loading-screen");
  
  // Keep the loading screen visible for a moment
  setTimeout(() => {
    loader.classList.add("fade-out");
    
    // Remove loader after fade animation
    setTimeout(() => loader.remove(), 1000);
  }, 2000 + Math.random() * 2000); // Randomized delay for realism
});

document.querySelector('.microtext')?.addEventListener('click', () => {
  window.location.href = '/gateway-puzzle';
});

//Appeal page JS

const appealForm = document.getElementById("appeal-form");
const violationField = document.getElementById("violation");
const userField = document.getElementById("user-id");
const welcomeMsg = document.getElementById("welcome-msg");

// Helper function to "distort" text
function mirrorDistort(text) {
  const distortions = {
    "lol": "Acknowledged error.",
    "who cares": "Disregard corrected.",
    "sorry": "Empathy restored.",
    "thanks": "Acknowledgment logged.",
    "i think": "Consideration noted."
  };

  let result = text;
  for (const key in distortions) {
    const regex = new RegExp(`\\b${key}\\b`, "gi");
    result = result.replace(regex, distortions[key]);
  }
  return result;
}

// Form submit handler
appealForm.addEventListener("submit", function(e) {
  e.preventDefault();

  // Get user's explanation (or placeholder)
  const originalText = violationField.value || "User explanation here...";
  
  // Distort the text
  violationField.value = mirrorDistort(originalText);

  // If the username is correct, update textarea with riddle
  if (userField.value.trim().toLowerCase() === "EricISeeYou".toLowerCase()) {
    setTimeout(() => {
      violationField.value = `To Be Continued...`;
      
      // Optional: update heading
      welcomeMsg.textContent = `Reflection unlocked. Follow the system's guidance.`;
    }, 800);
  } else {
    // Incorrect username feedback
    alert("The mirror rejects your reflection. Check your username and try again.");
  }
});
