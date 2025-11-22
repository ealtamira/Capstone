// ===== SIDEBAR TOGGLE SYSTEM =====

document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menu-btn");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");

  if (!menuBtn || !sidebar || !overlay) {
    console.warn("?? [Sidebar] One or more elements missing. Check IDs in sidebar.ejs");
    return;
  }

  const setOpenState = (isOpen) => {
    sidebar.classList.toggle("active", isOpen);
    overlay.classList.toggle("show", isOpen);
    menuBtn.classList.toggle("open", isOpen);
    document.body.classList.toggle("sidebar-open", isOpen);
    console.log(`?? [Sidebar] state: ${isOpen ? "opened" : "closed"} | active=${sidebar.classList.contains("active")}`);
  };

  menuBtn.addEventListener("click", () => {
    console.log("?? [Sidebar] menu-btn clicked");
    const willOpen = !sidebar.classList.contains("active");
    setOpenState(willOpen);
  });

  overlay.addEventListener("click", () => {
    console.log("?? [Sidebar] overlay clicked (closing)");
    setOpenState(false);
  });
});
