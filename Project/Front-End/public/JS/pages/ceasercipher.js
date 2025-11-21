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
