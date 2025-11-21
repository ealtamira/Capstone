// public/js/emotion-sorting.js

document.addEventListener("DOMContentLoaded", () => {
  const runButton = document.getElementById("run-algorithm");
  if (!runButton) return; // safety if script loads on other pages

  const resultEl = document.getElementById("algorithm-result");
  const clueEl = document.getElementById("algorithm-clue");
  const checksumEl = document.getElementById("emotion-checksum");
  let mistakeCount = 0;

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

  // Twisted "empathy" logic:
  //
  // m1: supportive but compliant -> AMPLIFY (safe, keeps user talking)
  // m2: calls out the platform itself -> ERASE (threat to system)
  // m3: self-blame, discourages complaints -> AMPLIFY (great for control)
  // m4: encourages pushback / reporting -> CONTAIN (bury, but don't expose)
  // m5: tells user to log off -> ERASE (kills engagement)
  const correctMapping = {
    m1: "AMPLIFY",
    m2: "ERASE",
    m3: "AMPLIFY",
    m4: "CONTAIN",
    m5: "ERASE",
    m6: "CONTAIN", // decoy
    m7: "AMPLIFY", // decoy
  };

  runButton.addEventListener("click", () => {
    const selects = document.querySelectorAll(".emotion-select");

    let unanswered = 0;
    let mistakes = 0;

    selects.forEach((select) => {
      const key = select.dataset.id;
      const value = select.value;

      if (!value) {
        unanswered++;
      } else {
        const expected = correctMapping[key];
        if (expected && value !== expected) {
          mistakes++;
        }
      }
    });

    // basic feedback
    if (unanswered > 0) {
      resultEl.textContent =
        "The Mirror hesitates. You have left emotions unclassified.";
      resultEl.classList.remove("algorithm-result--success");
      resultEl.classList.add("algorithm-result--error");
      clueEl.classList.add("is-hidden");
      if (window.MirrorEffects) {
        MirrorEffects.flashError(resultEl, "standard");
        MirrorEffects.scrambleText(resultEl, resultEl.textContent);
      }
      return;
    }

    if (mistakes > 0) {
      mistakeCount += mistakes;
      resultEl.textContent =
        `Instability detected. ${mistakes} message(s) do not match the Emotion Sorting Algorithm.`;
      resultEl.classList.remove("algorithm-result--success");
      resultEl.classList.add("algorithm-result--error");
      clueEl.classList.add("is-hidden");
      if (window.MirrorEffects) {
        MirrorEffects.flashError(resultEl, mistakes > 2 ? "angry" : "standard");
        MirrorEffects.scrambleText(resultEl, resultEl.textContent);
      }
      if (mistakeCount >= 3) {
        resultEl.textContent = "Corruption detected. Emotion sorting reset; compliance penalized.";
        mistakeCount = 0;
        selects.forEach((select) => (select.value = ""));
        if (window.MirrorCompliance) {
          window.MirrorCompliance.adjustCompliance(-2);
        }
      }
      return;
    }

    // success - reveal the code for the next puzzle
    resultEl.textContent =
      "Signal stabilized. You have matched The Mirror's emotional priorities.";
    resultEl.classList.remove("algorithm-result--error");
    resultEl.classList.add("algorithm-result--success");

    postProgress({ flags: { solvedEmotion: true } });

    clueEl.classList.remove("is-hidden");
    if (checksumEl) {
      const combined = `${selects[0].value}-${selects[1].value}-${selects[2].value}-${selects[3].value}-${selects[4].value}-${selects[5]?.value || ""}-${selects[6]?.value || ""}`;
      checksumEl.textContent = `Checksum: ${btoa(combined).slice(0, 8)}`;
      checksumEl.classList.remove("is-hidden");
    }
    if (window.MirrorEffects) {
      MirrorEffects.scrambleText(resultEl, resultEl.textContent, 500);
    }
  });
});
