/* ==============================
   EMPATHY CALIBRATION TEST
   ============================== */

if (document.getElementById("question-list")) {
  console.log("%c[MIRROR_LOG] Empathy Calibration Online", "color:#00ffff; font-weight:bold;");

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

  const questions = {
    q1: {
      rewrites: {
        a: { text: "System: Interpreting response as performative sympathy. Reducing emotional distance score.", token: "ECHO" },
        b: { text: "System: Normalizing public ridicule. Marking as tolerance of humiliation.", token: "" },
        c: { text: "System: Logging passive observation of harm. Empathy flagged as conditional.", token: "" }
      }
    },
    q2: {
      rewrites: {
        a: { text: "System: Private correction detected. Categorizing as low-visibility intervention.", token: "" },
        b: { text: "System: Public confrontation detected. Categorizing as reputational control.", token: "CALIBRATE" },
        c: { text: "System: Non-intervention detected. Categorizing as conflict-avoidant compliance.", token: "" }
      }
    },
    q3: {
      rewrites: {
        a: { text: "System: Apology issued. Categorizing as guilt-driven self-preservation.", token: "" },
        b: { text: "System: Deflection detected. Categorizing as emotional invalidation.", token: "" },
        c: { text: "System: Silence detected. Categorizing as emotional withdrawal.", token: "" }
      }
    }
  };

  const answered = new Set();
  const questionBlocks = document.querySelectorAll(".question-block");
  const summarySection = document.getElementById("summary-section");
  const codeInput = document.getElementById("calibration-code");
  const codeSubmit = document.getElementById("calibration-submit");
  const codeFeedback = document.getElementById("calibration-feedback");
  const collectedTokens = new Set();
  const tokenUsage = new Map(); // tracks how many times a token is selected across questions
  const selections = new Map(); // current option choice per question
  let failedCodes = 0;
  let lockout = false;
  let lockTimer = null;

  function checkAllAnswered() {
    if (answered.size === questionBlocks.length) {
      summarySection.classList.remove("hidden");
      console.log("%c[MIRROR_LOG] Calibration complete. Awaiting keyword.", "color:#00ff88;");
    }
  }

  function updateTokensForQuestion(qId, prevOptionId, nextOptionId) {
    const data = questions[qId];
    if (!data || !data.rewrites) return;

    const prevToken = prevOptionId ? data.rewrites[prevOptionId]?.token : "";
    const nextToken = nextOptionId ? data.rewrites[nextOptionId]?.token : "";

    if (prevToken) {
      const count = tokenUsage.get(prevToken) || 0;
      if (count <= 1) {
        tokenUsage.delete(prevToken);
        collectedTokens.delete(prevToken);
      } else {
        tokenUsage.set(prevToken, count - 1);
      }
    }

    if (nextToken) {
      const count = tokenUsage.get(nextToken) || 0;
      tokenUsage.set(nextToken, count + 1);
      collectedTokens.add(nextToken);
    }
  }

  // Attach handlers to options
  questionBlocks.forEach(block => {
    const qId = block.getAttribute("data-question-id");
    const opts = Array.from(block.querySelectorAll(".option-btn"));
    const rewriteEl = block.querySelector('[data-role="rewrite"]');

    // shuffle options
    const shuffled = opts.sort(() => Math.random() - 0.5);
    if (opts.length) {
      opts[0].parentElement.innerHTML = "";
      const wrapper = document.createDocumentFragment();
      shuffled.forEach((btn) => wrapper.appendChild(btn));
      block.querySelector(".options").appendChild(wrapper);
    }

    opts.forEach(btn => {
      btn.addEventListener("click", () => {
        const oId = btn.getAttribute("data-option-id");
        const previousSelection = selections.get(qId);
        const data = questions[qId];

        // allow reselection by toggling classes instead of disabling options
        opts.forEach(b => {
          b.disabled = false;
          if (b !== btn) {
            b.classList.remove("selected");
          }
        });
        btn.classList.add("selected");

        if (data && data.rewrites[oId] && rewriteEl) {
          const entry = data.rewrites[oId];
          rewriteEl.textContent = entry.text;
          if (entry.token) {
            updateTokensForQuestion(qId, previousSelection, oId);
            rewriteEl.textContent += ` [${entry.token}]`;
          } else {
            updateTokensForQuestion(qId, previousSelection, oId);
          }
        } else {
          updateTokensForQuestion(qId, previousSelection, oId);
        }

        selections.set(qId, oId);
        answered.add(qId);
        checkAllAnswered();
      });
    });
  });

  // Handle calibration code
  codeSubmit.addEventListener("click", () => {
    if (lockout) {
      codeFeedback.textContent = "Lockout active. Please wait.";
      codeFeedback.style.color = "#ff4444";
      return;
    }

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

    const tokenArray = Array.from(collectedTokens);
    const expected = tokenArray.length >= 2 ? `${tokenArray[0]}-${tokenArray[1]}` : "";
    const altExpected =
      tokenArray.length >= 2 ? `${tokenArray[1]}-${tokenArray[0]}` : "";

    if (expected && (value === expected || value === altExpected)) {
      codeFeedback.textContent = "Keyword accepted. Empathy parameters recalibrated.";
      codeFeedback.style.color = "#00ff88";
      postProgress({ flags: { solvedEmpathy: true } });

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
      failedCodes += 1;
      if (failedCodes >= 2) {
        lockout = true;
        codeFeedback.textContent = "Too many bad codes. Locked for 10s.";
        lockTimer = setTimeout(() => {
          lockout = false;
          failedCodes = 0;
          codeFeedback.textContent = "";
        }, 10000);
      }
    }
  });
}
