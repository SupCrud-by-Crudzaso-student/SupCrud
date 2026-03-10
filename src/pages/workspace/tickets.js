import { getState } from "../../store/store.js";
import { navigate } from "../../router/router.js";
import { renderSidebar, setupLogout } from "../../components/sidebar.js";
import { mockTickets, mockMembers } from "../../mocks/data.js";
import { statusBadge, priorityBadge, typeBadge, formatDate, paginate, paginationHTML, avatarHTML } from "../../components/helpers.js";
import { toast } from "../../components/toast.js";

const PAGE_SIZE = 8;

export function renderTickets(container) {
  const { user, role, activeWorkspace } = getState();
  if (!user) { navigate("/login"); return; }

  setupLogout();

  let currentPage = 1;
  let filters = { status: "", type: "", priority: "", agent: "", search: "" };

  function getFiltered() {
    const q = filters.search.toLowerCase().trim();
    return mockTickets.filter(t => {
      if (t.workspaceId !== activeWorkspace?.id) return false;
      if (filters.status   && t.status   !== filters.status)   return false;
      if (filters.type     && t.type     !== filters.type)     return false;
      if (filters.priority && t.priority !== filters.priority) return false;
      if (filters.agent    && t.assignedAgentId !== filters.agent) return false;
      if (q && !t.subject.toLowerCase().includes(q)
            && !t.referenceCode.toLowerCase().includes(q)
            && !(t.email || "").toLowerCase().includes(q)) return false;
      return true;
    });
  }

  function exportCSV(tickets) {
    const headers = ["Código", "Asunto", "Tipo", "Estado", "Prioridad", "Agente", "Email", "Creado"];
    const typeMap = { P: "Petición", Q: "Queja", R: "Reclamo", S: "Sugerencia" };
    const statusMap = { OPEN: "Abierto", IN_PROGRESS: "En progreso", RESOLVED: "Resuelto", CLOSED: "Cerrado", REOPENED: "Reabierto" };
    const priorityMap = { LOW: "Baja", MEDIUM: "Media", HIGH: "Alta", URGENT: "Urgente" };
    const rows = tickets.map(t => [
      t.referenceCode,
      `"${t.subject.replace(/"/g, '""')}"`,
      typeMap[t.type] || t.type,
      statusMap[t.status] || t.status,
      priorityMap[t.priority] || t.priority,
      t.assignedAgent || "Sin asignar",
      t.email || "",
      new Date(t.createdAt).toLocaleDateString("es-CO"),
    ]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tickets-${activeWorkspace?.workspaceKey || "export"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exportado correctamente");
  }

  function render() {
    const filtered = getFiltered();
    const { items, pages } = paginate(filtered, currentPage, PAGE_SIZE);

    container.innerHTML = `
      <div class="dashboard-layout">
        ${renderSidebar("tickets", role)}
        <div class="main-content">
          <header class="topbar">
            <span class="topbar-title">Tickets</span>
            <div class="topbar-actions">
              <button class="btn btn-outline btn-sm" id="btn-export-csv">&#8595; Exportar CSV</button>
            </div>
          </header>
          <div class="page-body">

            <!-- Stats rápidas -->
            <div class="stats-grid">
              ${quickStats(mockTickets.filter(t => t.workspaceId === activeWorkspace?.id))}
            </div>

            <!-- Búsqueda + Filtros -->
            <div class="card" style="margin-bottom:1rem;padding:1rem">
              <div style="margin-bottom:.75rem">
                <input class="form-control" type="text" id="f-search"
                  placeholder="Buscar por asunto, código o email..."
                  value="${filters.search}" />
              </div>
              <div class="filters-bar">
                <select class="form-control form-select" id="f-status">
                  <option value="">Todos los estados</option>
                  <option value="OPEN">Abierto</option>
                  <option value="IN_PROGRESS">En progreso</option>
                  <option value="RESOLVED">Resuelto</option>
                  <option value="CLOSED">Cerrado</option>
                  <option value="REOPENED">Reabierto</option>
                </select>
                <select class="form-control form-select" id="f-type">
                  <option value="">Todos los tipos</option>
                  <option value="P">Petición</option>
                  <option value="Q">Queja</option>
                  <option value="R">Reclamo</option>
                  <option value="S">Sugerencia</option>
                </select>
                <select class="form-control form-select" id="f-priority">
                  <option value="">Todas las prioridades</option>
                  <option value="LOW">Baja</option>
                  <option value="MEDIUM">Media</option>
                  <option value="HIGH">Alta</option>
                  <option value="URGENT">Urgente</option>
                </select>
                <select class="form-control form-select" id="f-agent">
                  <option value="">Todos los agentes</option>
                  ${mockMembers.map(m => `<option value="${m.userId}">${m.name}</option>`).join("")}
                </select>
                <button class="btn btn-ghost btn-sm" id="btn-clear-filters">Limpiar</button>
              </div>
            </div>

            <!-- Conteo de resultados -->
            <div style="margin-bottom:.5rem;font-size:.83rem;color:#64748b">
              Mostrando <strong>${filtered.length}</strong> ticket${filtered.length !== 1 ? "s" : ""}
            </div>

            <!-- Tabla -->
            <div class="card" style="padding:0">
              ${items.length === 0
                ? `<div class="empty-state">
                     <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/></svg>
                     <h3>No hay tickets</h3>
                     <p>No se encontraron tickets con los filtros actuales.</p>
                   </div>`
                : `<div class="table-wrapper">
                     <table>
                       <thead>
                         <tr>
                           <th>Código</th>
                           <th>Asunto</th>
                           <th>Tipo</th>
                           <th>Estado</th>
                           <th>Prioridad</th>
                           <th>Agente</th>
                           <th>Creado</th>
                           <th></th>
                         </tr>
                       </thead>
                       <tbody>
                         ${items.map(t => `
                           <tr>
                             <td><code style="font-size:.78rem;color:#6366f1">${t.referenceCode}</code></td>
                             <td style="max-width:220px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${t.subject}</td>
                             <td>${typeBadge(t.type)}</td>
                             <td>${statusBadge(t.status)}</td>
                             <td>${priorityBadge(t.priority)}</td>
                             <td>${t.assignedAgent
                               ? `<div style="display:flex;align-items:center;gap:.4rem">${avatarHTML(t.assignedAgent)}<span style="font-size:.83rem">${t.assignedAgent}</span></div>`
                               : `<span class="text-muted" style="font-size:.83rem">Sin asignar</span>`}
                             </td>
                             <td style="font-size:.82rem;color:#64748b">${formatDate(t.createdAt)}</td>
                             <td>
                               <button class="btn btn-ghost btn-sm" onclick="navigate('/workspace/${activeWorkspace?.workspaceKey}/tickets/${t.id}')">Ver →</button>
                             </td>
                           </tr>
                         `).join("")}
                       </tbody>
                     </table>
                   </div>
                   ${paginationHTML(currentPage, pages, `(p) => { window._goPage(p); }`)}`
              }
            </div>

          </div>
        </div>
      </div>
    `;

    bindFilters();

    window._goPage = (p) => { currentPage = p; render(); };

    document.getElementById("btn-export-csv")?.addEventListener("click", () => exportCSV(getFiltered()));
  }

  function bindFilters() {
    // Búsqueda en tiempo real
    const searchEl = document.getElementById("f-search");
    if (searchEl) {
      searchEl.addEventListener("input", () => {
        filters.search = searchEl.value;
        currentPage = 1;
        render();
      });
    }

    const setFilter = (id, key) => {
      const el = document.getElementById(id);
      if (el) {
        el.value = filters[key];
        el.addEventListener("change", () => { filters[key] = el.value; currentPage = 1; render(); });
      }
    };
    setFilter("f-status",   "status");
    setFilter("f-type",     "type");
    setFilter("f-priority", "priority");
    setFilter("f-agent",    "agent");
    document.getElementById("btn-clear-filters")?.addEventListener("click", () => {
      filters = { status: "", type: "", priority: "", agent: "", search: "" };
      currentPage = 1;
      render();
    });
  }

  render();
}

function quickStats(tickets) {
  const open = tickets.filter(t => t.status === "OPEN").length;
  const inProgress = tickets.filter(t => t.status === "IN_PROGRESS").length;
  const resolved = tickets.filter(t => t.status === "RESOLVED").length;
  return `
    <div class="stat-card"><div class="stat-icon purple"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/></svg></div><div><div class="stat-label">Total tickets</div><div class="stat-value">${tickets.length}</div></div></div>
    <div class="stat-card"><div class="stat-icon blue"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div><div><div class="stat-label">Abiertos</div><div class="stat-value">${open}</div></div></div>
    <div class="stat-card"><div class="stat-icon orange"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div><div><div class="stat-label">En progreso</div><div class="stat-value">${inProgress}</div></div></div>
    <div class="stat-card"><div class="stat-icon green"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg></div><div><div class="stat-label">Resueltos</div><div class="stat-value">${resolved}</div></div></div>
  `;
}
