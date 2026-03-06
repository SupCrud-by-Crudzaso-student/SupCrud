// ─── Formato de fechas ────────────────────────────────────────────────────────

export function formatDate(iso) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("es-CO", {
    year: "numeric", month: "short", day: "numeric",
  });
}

export function formatDateTime(iso) {
  if (!iso) return "-";
  return new Date(iso).toLocaleString("es-CO", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

// ─── Iniciales para avatar ────────────────────────────────────────────────────

export function initials(name = "") {
  return name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
}

// ─── Badges ──────────────────────────────────────────────────────────────────

const statusLabel = { OPEN: "Abierto", IN_PROGRESS: "En progreso", RESOLVED: "Resuelto", CLOSED: "Cerrado", REOPENED: "Reabierto" };
const priorityLabel = { LOW: "Baja", MEDIUM: "Media", HIGH: "Alta", URGENT: "Urgente" };
const typeLabel = { P: "Petición", Q: "Queja", R: "Reclamo", S: "Sugerencia" };

export function statusBadge(status) {
  return `<span class="badge badge-${status.toLowerCase()}">${statusLabel[status] || status}</span>`;
}

export function priorityBadge(priority) {
  return `<span class="badge badge-${priority.toLowerCase()}">${priorityLabel[priority] || priority}</span>`;
}

export function typeBadge(type) {
  return `<span class="badge badge-${type.toLowerCase()}">${type} — ${typeLabel[type] || type}</span>`;
}

export function workspaceStatusBadge(status) {
  return `<span class="badge badge-${status.toLowerCase()}">${status === "ACTIVE" ? "Activo" : "Suspendido"}</span>`;
}

// ─── Avatar HTML ─────────────────────────────────────────────────────────────

export function avatarHTML(name, size = "") {
  return `<div class="avatar ${size}">${initials(name)}</div>`;
}

// ─── Paginación ───────────────────────────────────────────────────────────────

export function paginate(items, page, perPage = 8) {
  const total = items.length;
  const pages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage;
  const slice = items.slice(start, start + perPage);
  return { items: slice, total, pages, page };
}

export function paginationHTML(currentPage, totalPages, onPage) {
  if (totalPages <= 1) return "";
  let html = `<div class="pagination">`;
  html += `<button class="page-btn" ${currentPage === 1 ? "disabled" : ""} onclick="(${onPage})(${currentPage - 1})">‹</button>`;
  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="page-btn ${i === currentPage ? "active" : ""}" onclick="(${onPage})(${i})">${i}</button>`;
  }
  html += `<button class="page-btn" ${currentPage === totalPages ? "disabled" : ""} onclick="(${onPage})(${currentPage + 1})">›</button>`;
  html += `</div>`;
  return html;
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export function openModal(contentHTML, onClose) {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.innerHTML = `<div class="modal">${contentHTML}</div>`;
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) { overlay.remove(); onClose?.(); }
  });
  document.body.appendChild(overlay);
  return overlay;
}

export function closeModal() {
  document.querySelector(".modal-overlay")?.remove();
}
