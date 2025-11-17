// ===== SIDEBAR TOGGLE SYSTEM =====

document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menu-btn");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");

  if (!menuBtn || !sidebar || !overlay) {
    console.warn("⚠️ [Sidebar] One or more elements missing. Check IDs in sidebar.ejs");
    return;
  }

  menuBtn.addEventListener("click", () => {
    console.log("👉 [Sidebar] menu-btn clicked");

    sidebar.classList.toggle("active");
    overlay.classList.toggle("show"); // MUST match your CSS: .overlay.show { ... }

    logState("after menu click");
  });

  overlay.addEventListener("click", () => {
    console.log("🫥 [Sidebar] overlay clicked (closing)");

    sidebar.classList.remove("active");
    overlay.classList.remove("show");

    logState("after overlay click");
  });
});