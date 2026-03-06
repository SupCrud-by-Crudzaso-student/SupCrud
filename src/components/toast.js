// Sistema de notificaciones toast

function getContainer() {
  let c = document.getElementById("toast-container");
  if (!c) {
    c = document.createElement("div");
    c.id = "toast-container";
    c.className = "toast-container";
    document.body.appendChild(c);
  }
  return c;
}

function show(message, type = "info", duration = 3500) {
  const container = getContainer();
  const icons = { success: "✓", error: "✕", info: "ℹ" };
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${icons[type] || "ℹ"}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(8px)";
    toast.style.transition = ".2s ease";
    setTimeout(() => toast.remove(), 250);
  }, duration);
}

export const toast = {
  success: (msg) => show(msg, "success"),
  error:   (msg) => show(msg, "error"),
  info:    (msg) => show(msg, "info"),
};
