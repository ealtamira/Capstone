// ===== APPEAL PAGE LOGIC =====
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

// Only attach this event listener if the form actually exists
if (appealForm) {
  appealForm.addEventListener("submit", function(e) {
    e.preventDefault();

    // Safely check all fields exist
    if (!violationField || !userField || !welcomeMsg) return;

    const originalText = violationField.value || "User explanation here...";
    violationField.value = mirrorDistort(originalText);

    if (userField.value.trim().toLowerCase() === "ericiseeyou") {
      // ✅ Correct username → push to empathy test
      welcomeMsg.textContent = "Additional empathy calibration required.";
      violationField.value = "Redirecting to Empathy Calibration Protocol...";

      setTimeout(() => {
        window.location.href = "/empathy-test";
      }, 1200);
    } else {
      alert("The mirror rejects your reflection. Check your username and try again.");
    }
  });
}
