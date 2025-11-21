document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("rot13Form");
  const textEl = document.getElementById("rot-text");
  const resultEl = document.getElementById("rot-result");
  if (!form || !textEl || !resultEl) return;

  const rot13 = (s) =>
    s.replace(/[a-zA-Z]/g, (c) =>
      String.fromCharCode(
        c <= "Z"
          ? ((c.charCodeAt(0) - 65 + 13) % 26) + 65
          : ((c.charCodeAt(0) - 97 + 13) % 26) + 97
      )
    );

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    resultEl.textContent = rot13(textEl.value || "");
  });
});
