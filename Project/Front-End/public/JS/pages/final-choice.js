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

    const compliance = window.MirrorCompliance ? window.MirrorCompliance.getCompliance() : 96;
    let destination = value;

    // Tie compliance to ending:
    // - If compliance < 50, the system forces deception ending.
    // - Submit requires >= 75 or it is rejected.
    // - Disconnect is always allowed.
    if (compliance < 50) {
      destination = "deceive";
      if (errorEl) {
        errorEl.textContent = "Compliance too low. The Mirror reroutes you to concealment.";
      }
    } else if (value === "submit" && compliance < 75) {
      if (errorEl) {
        errorEl.textContent = "Compliance insufficient to fully submit. Raise it or choose another path.";
      }
      if (window.MirrorEffects) {
        MirrorEffects.flashError(form, "angry");
        MirrorEffects.scrambleText(errorEl, errorEl.textContent);
      }
      return;
    }

    const route = destination === "disconnect"
      ? "/final-disconnect"
      : destination === "submit"
        ? "/final-submit"
        : "/final-deceive";

    if (window.MirrorCompliance && destination === "submit") {
      window.MirrorCompliance.adjustCompliance(3);
    } else if (window.MirrorCompliance && destination === "deceive") {
      window.MirrorCompliance.adjustCompliance(-3);
    }

    window.location.href = route;
  });
});
