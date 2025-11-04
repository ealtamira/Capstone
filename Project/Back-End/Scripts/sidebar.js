const menuBtn = document.getElementById("menu-btn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

menuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("active");
  overlay.classList.toggle("show");
});

overlay.addEventListener("click", () => {
  sidebar.classList.remove("active");
  overlay.classList.remove("show");
});

function useTool(tool) {
  switch (tool) {
    case "Hint":
      alert("💡 The reflection hides your truth...");
      break;
    case "Cipher":
      alert("🧩 Cipher Helper coming soon.");
      break;
    case "Notebook":
      alert("📓 Virtual notes unavailable yet.");
      break;
    case "Reset":
      if (confirm("Reset puzzle progress?")) {
        alert("Puzzle reset.");
      }
      break;
  }
}
