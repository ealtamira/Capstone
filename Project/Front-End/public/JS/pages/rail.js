document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("railForm");
  const textEl = document.getElementById("rail-text");
  const railsEl = document.getElementById("rail-rails");
  const resultEl = document.getElementById("rail-result");
  if (!form || !textEl || !railsEl || !resultEl) return;

  function railFenceDecode(cipher, rails) {
    if (rails < 2) return cipher;
    const len = cipher.length;
    const rail = Array.from({ length: rails }, () => Array(len).fill("\n"));
    let dirDown = false;
    let row = 0;
    let col = 0;

    for (let i = 0; i < len; i++) {
      if (row === 0 || row === rails - 1) dirDown = !dirDown;
      rail[row][col++] = "*";
      row += dirDown ? 1 : -1;
    }

    let idx = 0;
    for (let i = 0; i < rails; i++) {
      for (let j = 0; j < len; j++) {
        if (rail[i][j] === "*" && idx < len) rail[i][j] = cipher[idx++];
      }
    }

    let result = "";
    row = 0;
    col = 0;
    dirDown = false;
    for (let i = 0; i < len; i++) {
      if (row === 0 || row === rails - 1) dirDown = !dirDown;
      result += rail[row][col++];
      row += dirDown ? 1 : -1;
    }
    return result;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const txt = (textEl.value || "").replace(/\\s+/g, "");
    const rails = parseInt(railsEl.value, 10) || 3;
    resultEl.textContent = railFenceDecode(txt, rails);
  });
});
