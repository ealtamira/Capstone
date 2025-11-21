// Compliance state manager (ties HUD to endings)
(function () {
  const STORAGE_KEY = "mirror_compliance";
  const DEFAULT_VALUE = 96;

  const clamp = (v) => Math.max(0, Math.min(100, Math.round(v)));

  function getCompliance() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null || raw === undefined) return DEFAULT_VALUE;

    const parsed = parseFloat(raw);
    if (Number.isFinite(parsed)) return clamp(parsed);
    return DEFAULT_VALUE;
  }

  function syncHUD(value = getCompliance()) {
    if (window.MirrorUI?.updateHUD) {
      window.MirrorUI.updateHUD(value >= 80 ? "Signal Stable" : "Signal Corrupted", String(value));
    }
  }

  function setCompliance(value) {
    const next = clamp(value);
    localStorage.setItem(STORAGE_KEY, String(next));
    syncHUD(next);
    return next;
  }

  function adjustCompliance(delta) {
    return setCompliance(getCompliance() + delta);
  }

  function initCompliance() {
    syncHUD(getCompliance());
  }

  window.MirrorCompliance = {
    getCompliance,
    setCompliance,
    adjustCompliance,
    initCompliance,
    syncHUD,
  };
})();
