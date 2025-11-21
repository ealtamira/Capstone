document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("img-input");
  const canvas = document.getElementById("img-canvas");
  const ctx = canvas?.getContext("2d");
  const opacityEl = document.getElementById("img-opacity");
  const grayEl = document.getElementById("img-grayscale");
  const rotateLeft = document.getElementById("rotate-left");
  const rotateRight = document.getElementById("rotate-right");
  const resetBtn = document.getElementById("reset-img");
  const downloadBtn = document.getElementById("download-img");

  if (!fileInput || !canvas || !ctx || !opacityEl || !grayEl) return;

  const state = {
    img: null,
    rotation: 0,
    opacity: 1,
    grayscale: false,
  };

  function draw() {
    if (!state.img) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((state.rotation * Math.PI) / 180);
    ctx.globalAlpha = state.opacity;
    if (state.grayscale) {
      ctx.filter = "grayscale(1)";
    } else {
      ctx.filter = "none";
    }
    const scale = Math.min(canvas.width / state.img.width, canvas.height / state.img.height);
    const w = state.img.width * scale;
    const h = state.img.height * scale;
    ctx.drawImage(state.img, -w / 2, -h / 2, w, h);
    ctx.restore();
  }

  fileInput.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        state.img = img;
        state.rotation = 0;
        state.opacity = 1;
        state.grayscale = false;
        opacityEl.value = "100";
        grayEl.checked = false;
        draw();
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

  opacityEl.addEventListener("input", () => {
    state.opacity = Math.max(0.1, Math.min(1, parseInt(opacityEl.value, 10) / 100));
    draw();
  });

  grayEl.addEventListener("change", () => {
    state.grayscale = grayEl.checked;
    draw();
  });

  rotateLeft?.addEventListener("click", () => {
    state.rotation = (state.rotation - 90) % 360;
    draw();
  });

  rotateRight?.addEventListener("click", () => {
    state.rotation = (state.rotation + 90) % 360;
    draw();
  });

  resetBtn?.addEventListener("click", () => {
    state.rotation = 0;
    state.opacity = 1;
    state.grayscale = false;
    opacityEl.value = "100";
    grayEl.checked = false;
    draw();
  });

  downloadBtn?.addEventListener("click", () => {
    if (!state.img) return;
    const link = document.createElement("a");
    link.download = "mirror-image.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
});
