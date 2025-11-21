document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".final-choice-form");
  const submitCodeInput = document.getElementById("final-submit-code");
  if (!form) return;

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

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const selected = form.querySelector('input[name="choice"]:checked');
    const errorEl = document.querySelector("[data-choice-error]");

    if (!selected) {
      if (errorEl) errorEl.textContent = "Select one path to continue.";
      return;
    }

    const value = selected.value;
    if (errorEl) errorEl.textContent = "";

    const compliance = window.MirrorCompliance ? window.MirrorCompliance.getCompliance() : 96;
    let destination = value;

    // Compliance gates
    if (compliance < 50) {
      destination = "deceive";
      if (errorEl) {
        errorEl.textContent = "Compliance too low. The Mirror reroutes you to concealment.";
      }
    } else if (value === "submit" && compliance < 85) {
      if (errorEl) {
        errorEl.textContent = "Compliance insufficient to fully submit. Raise it or choose another path.";
      }
      if (window.MirrorEffects) {
        MirrorEffects.flashError(form, "angry");
        MirrorEffects.scrambleText(errorEl, errorEl.textContent);
      }
      return;
    }

    // Submit requires secondary code from puzzles
    if (value === "submit") {
      const code = (submitCodeInput?.value || "").trim().toUpperCase();
      if (code !== "DEPTH_TRACE") {
        if (errorEl) {
          errorEl.textContent = "Secondary code invalid. Retrieve it from the Echo Labyrinth.";
        }
        if (window.MirrorEffects) {
          MirrorEffects.flashError(form, "angry");
          MirrorEffects.scrambleText(errorEl, errorEl.textContent);
        }
        return;
      }
    }

    // Deceive requires NullUser signal
    if (value === "deceive") {
      const hasNullSignal = localStorage.getItem("mirror_nulluser_hint") === "1";
      if (!hasNullSignal) {
        if (errorEl) {
          errorEl.textContent = "Signal missing. @NullUser must vouch for your escape.";
        }
        if (window.MirrorEffects) {
          MirrorEffects.flashError(form, "standard");
          MirrorEffects.scrambleText(errorEl, errorEl.textContent);
        }
        return;
      }
    }

    const route = destination === "disconnect"
      ? "/final-disconnect"
      : destination === "submit"
        ? "/final-submit"
        : "/final-deceive";

    try {
      if (destination === "submit") {
        localStorage.setItem("mirror_submit_shadow", "1");
      } else {
        localStorage.removeItem("mirror_submit_shadow");
      }
    } catch (e) {}

    if (destination === "deceive") {
      try {
        localStorage.setItem("mirror_copy_glitch", "1");
      } catch (e) {}
    } else {
      try {
        localStorage.removeItem("mirror_copy_glitch");
      } catch (e) {}
    }

    if (window.MirrorCompliance && destination === "submit") {
      window.MirrorCompliance.adjustCompliance(3);
    } else if (window.MirrorCompliance && destination === "deceive") {
      window.MirrorCompliance.adjustCompliance(-3);
    }

    window.location.href = route;
    postProgress({ flags: { chosenEnding: destination } });
  });
});
