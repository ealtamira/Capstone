/* ==============================
   EMPATHY CALIBRATION TEST
   ============================== */

if (document.getElementById("question-list")) {
  console.log("%c[MIRROR_LOG] Empathy Calibration Online", "color:#00ffff; font-weight:bold;");

  const questions = {
    q1: {
      rewrites: {
        a: "System: Interpreting response as performative sympathy. Reducing emotional distance score.",
        b: "System: Normalizing public ridicule. Marking as tolerance of humiliation.",
        c: "System: Logging passive observation of harm. Empathy flagged as conditional."
      }
    },
    q2: {
      rewrites: {
        a: "System: Private correction detected. Categorizing as low-visibility intervention.",
        b: "System: Public confrontation detected. Categorizing as reputational control.",
        c: "System: Non-intervention detected. Categorizing as conflict-avoidant compliance."
      }
    },
    q3: {
      rewrites: {
        a: "System: Apology issued. Categorizing as guilt-driven self-preservation.",
        b: "System: Deflection detected. Categorizing as emotional invalidation.",
        c: "System: Silence detected. Categorizing as emotional withdrawal."
      }
    }
  };

  const answered = new Set();
  const questionBlocks = document.querySelectorAll(".question-block");
  const summarySection = document.getElementById("summary-section");
  const codeInput = document.getElementById("calibration-code");
  const codeSubmit = document.getElementById("calibration-submit");
  const codeFeedback = document.getElementById("calibration-feedback");

  function checkAllAnswered() {
    if (answered.size === questionBlocks.length) {
      summarySection.classList.remove("hidden");
      console.log("%c[MIRROR_LOG] Calibration complete. Awaiting keyword.", "color:#00ff88;");
    }
  }

  // Attach handlers to options
  questionBlocks.forEach(block => {
    const qId = block.getAttribute("data-question-id");
    const opts = block.querySelectorAll(".option-btn");
    const rewriteEl = block.querySelector('[data-role="rewrite"]');

    opts.forEach(btn => {
      btn.addEventListener("click", () => {
        const oId = btn.getAttribute("data-option-id");
        const data = questions[qId];

        // lock this question selection
        opts.forEach(b => b.disabled = true);
        btn.classList.add("selected");

        if (data && data.rewrites[oId] && rewriteEl) {
          rewriteEl.textContent = data.rewrites[oId];
        }

        answered.add(qId);
        checkAllAnswered();
      });
    });
  });

  // Handle calibration code
  codeSubmit.addEventListener("click", () => {
    const value = (codeInput.value || "").trim().toUpperCase();

    if (!value) {
      codeFeedback.textContent = "Field cannot be empty. The Mirror prefers honest attempts.";
      codeFeedback.style.color = "#ff4444";
      if (window.MirrorEffects) {
        MirrorEffects.flashError(codeInput, "standard");
        MirrorEffects.shake(codeInput);
      }
      return;
    }

    if (value === "CALIBRATE") {
      codeFeedback.textContent = "Keyword accepted. Empathy parameters recalibrated.";
      codeFeedback.style.color = "#00ff88";

      setTimeout(() => {
        // Adjust this to whatever route you want next:
        window.location.href = "/emotion-sorting";
      }, 1200);
    } else {
      codeFeedback.textContent = "Invalid keyword. Review the calibration log carefully.";
      codeFeedback.style.color = "#ff4444";

      if (window.MirrorEffects) {
        MirrorEffects.flashError(codeInput, "angry");
        MirrorEffects.shake(codeInput);
        MirrorEffects.scrambleText(codeFeedback, codeFeedback.textContent);
      }
    }
  });
}
