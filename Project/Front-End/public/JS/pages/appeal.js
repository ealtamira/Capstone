// ===== APPEAL PAGE LOGIC =====
const appealForm = document.getElementById("appeal-form");
const violationField = document.getElementById("violation");
const userField = document.getElementById("user-id");
const welcomeMsg = document.getElementById("welcome-msg");

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

// Fallback: reaching this page marks gateway as completed
document.addEventListener("DOMContentLoaded", () => {
  postProgress({ flags: { reachedGateway: true } });
});

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

    const handle = (userField.value || "").trim().toUpperCase();
    if (handle === "MIRRORHASYOU") {
      // Correct username -> push to empathy test
      welcomeMsg.textContent = "Additional empathy calibration required.";
      violationField.value = "Redirecting to Empathy Calibration Protocol...";

      setTimeout(() => {
        window.location.href = "/empathy-test";
      }, 1200);
    } else {
      userField.classList.add("error", "shake");
      userField.setAttribute("aria-invalid", "true");
      setTimeout(() => userField.classList.remove("shake"), 420);
     
      if (typeof window.triggerMirrorDisturbance === "function") {
        window.triggerMirrorDisturbance("angry");
      }
      if (window.MirrorUI?.showToast) {
        window.MirrorUI.showToast("@NullUser: They already rewrote that handle.", "danger");
      }
    }
  });
}
