document.getElementById("decodeForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const text = document.getElementById("text").value;
  const shift = document.getElementById("shift").value;

  const response = await fetch("http://localhost:3030/decode", { // <-- note 3030
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, shift }),
  });

  const data = await response.json();
  document.getElementById("resultText").innerText = data.result || "No result.";
});
