document.getElementById("decodeForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const text = document.getElementById("text").value;
  const shift = document.getElementById("shift").value;

  try {
    const response = await fetch("/decode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, shift }),
    });

    if (!response.ok) {
      throw new Error("Decode request failed");
    }

    const data = await response.json();
    document.getElementById("resultText").innerText =
      data.result || "No result.";
  } catch (err) {
    console.error("Error decoding text:", err);
    document.getElementById("resultText").innerText =
      "Error decoding text. Please try again.";
  }
});

// NullUser hidden trigger
(function () {
  const tap = document.getElementById("nulluser-tap-caesar");
  if (!tap) return;

  function maybeComplete() {
    const p1 = localStorage.getItem("mirror_nulluser_piece1") === "1";
    const p2 = localStorage.getItem("mirror_nulluser_piece2") === "1";
    if (p1 && p2) {
      localStorage.setItem("mirror_nulluser_hint", "1");
      if (window.MirrorUI?.showToast) {
        window.MirrorUI.showToast("@NullUser: Copy acknowledged.", "info");
      }
    }
  }

  tap.addEventListener("click", () => {
    localStorage.setItem("mirror_nulluser_piece1", "1");
    if (window.MirrorUI?.showToast) {
      window.MirrorUI.showToast("Checksum synced.", "info");
    }
    maybeComplete();
  });
})();
