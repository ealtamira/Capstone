const form = document.getElementById("verify-form");
const status = document.getElementById("status");

// Set the correct passcode (from the Reflection page)
const correctPasscode = "reflection_0821";

form.addEventListener("submit", e => {
  e.preventDefault();
  status.textContent = "Verifying reflection...";
  const code = document.getElementById("access-code").value.trim();

  if (code.toUpperCase() === correctPasscode.toUpperCase()) {
    status.textContent = "Access granted. Redirecting...";
    status.style.color = "#0f0";
    setTimeout(() => {
      window.location.href = "/appeal"; // or any page you want to go next
    }, 1200);
  } else {
    status.textContent = "Access denied. Reflection mismatch.";
    status.style.color = "#f00";
  }
});
