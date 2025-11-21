document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".final-choice-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const selected = form.querySelector('input[name="choice"]:checked');
    const errorEl = document.querySelector("[data-choice-error]");

    if (!selected) {
      if (errorEl) {
        errorEl.textContent = "Select one path to continue.";
      }
      return;
    }

    const value = selected.value;

    if (errorEl) {
      errorEl.textContent = "";
    }

    if (value === "disconnect") {
      window.location.href = "/final-disconnect";
    } else if (value === "submit") {
      window.location.href = "/final-submit";
    } else if (value === "deceive") {
      window.location.href = "/final-deceive";
    }
  });
});
