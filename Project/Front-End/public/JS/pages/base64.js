document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("b64Form");
  const textEl = document.getElementById("b64-text");
  const resultEl = document.getElementById("b64-result");
  if (!form || !textEl || !resultEl) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    try {
      const decoded = atob(textEl.value || "");
      resultEl.textContent = decoded;
    } catch (_e) {
      resultEl.textContent = "Invalid Base64.";
    }
  });
});
