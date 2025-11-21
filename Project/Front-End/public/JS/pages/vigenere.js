document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("vigenereForm");
  const textEl = document.getElementById("vig-text");
  const keyEl = document.getElementById("vig-key");
  const resultEl = document.getElementById("vig-result");

  if (!form || !textEl || !keyEl || !resultEl) return;

  function vigenereDecode(text, key) {
    if (!key) return text;
    const k = key.toUpperCase();
    let ki = 0;
    return text
      .split("")
      .map((ch) => {
        const upper = ch.toUpperCase();
        if (upper < "A" || upper > "Z") return ch;
        const shift = k.charCodeAt(ki % k.length) - 65;
        ki++;
        const code = upper.charCodeAt(0) - 65;
        return String.fromCharCode(((code - shift + 26) % 26) + 65);
      })
      .join("");
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const txt = textEl.value || "";
    const key = keyEl.value || "";

    if (!txt.trim() || !key.trim()) {
      resultEl.textContent = "Provide both encoded text and key.";
      if (window.MirrorEffects) {
        MirrorEffects.flashError(resultEl, "standard");
      }
      return;
    }

    const decoded = vigenereDecode(txt, key);
    resultEl.textContent = decoded;
  });

  // NullUser hidden trigger
  const tap = document.getElementById("nulluser-tap-vig");
  if (tap) {
    const maybeComplete = () => {
      const p1 = localStorage.getItem("mirror_nulluser_piece1") === "1";
      const p2 = localStorage.getItem("mirror_nulluser_piece2") === "1";
      if (p1 && p2) {
        localStorage.setItem("mirror_nulluser_hint", "1");
        if (window.MirrorUI?.showToast) {
          window.MirrorUI.showToast("@NullUser: Copy acknowledged.", "info");
        }
      }
    };

    tap.addEventListener("click", () => {
      localStorage.setItem("mirror_nulluser_piece2", "1");
      if (window.MirrorUI?.showToast) {
        window.MirrorUI.showToast("Echo synced.", "info");
      }
      maybeComplete();
    });
  }
});
