const form = document.getElementById("verify-form");
const status = document.getElementById("status");
const codeInput = document.getElementById("access-code");

// Set the correct passcode (from the Reflection page)
const correctPasscode = "reflection_0821";

form.addEventListener("submit", e => {
  e.preventDefault();
  status.textContent = "Verifying reflection...";
  status.style.color = "";
  codeInput.classList.remove("error");
  codeInput.setAttribute("aria-invalid", "false");
  const code = codeInput.value.trim();

  if (code.toUpperCase() === correctPasscode.toUpperCase()) {
    status.textContent = "Access granted. Redirecting...";
    status.style.color = "#0f0";
    codeInput.classList.remove("error");
    codeInput.setAttribute("aria-invalid", "false");
    setTimeout(() => {
      window.location.href = "/appeal"; // or any page you want to go next
    }, 1200);
  } else {
    status.textContent = "Access denied. Reflection mismatch.";
    status.style.color = "#f00";
    codeInput.classList.add("error");
    codeInput.setAttribute("aria-invalid", "true");
    codeInput.focus();
    if (typeof window.triggerMirrorDisturbance === "function") {
      window.triggerMirrorDisturbance();
    }
  }
});
