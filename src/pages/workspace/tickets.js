import { getState } from "../../store/store.js";
import { navigate } from "../../router/router.js";
import { renderSidebar, setupLogout } from "../../components/sidebar.js";
import { mockTickets, mockMembers } from "../../mocks/data.js";
import { statusBadge, priorityBadge, typeBadge, formatDate, paginate, paginationHTML, openModal, closeModal, avatarHTML } from "../../components/helpers.js";
import { toast } from "../../components/toast.js";

const PAGE_SIZE = 8;

export function renderTickets(container) {
  const { user, role, activeWorkspace } = getState();
  if (!user) { navigate("/login"); return; }

  setupLogout();

  let currentPage = 1;
  let filters = { status: "", type: "", priority: "", agent: "" };

  function getFiltered() {
    return mockTickets.filter(t => {
      if (t.workspaceId !== activeWorkspace?.id) return false;
      if (filters.status   && t.status   !== filters.status)   return false;
      if (filters.type     && t.type     !== filters.type)     return false;
      if (filters.priority && t.priority !== filters.priority) return false;
      if (filters.agent    && t.assignedAgentId !== filters.agent) return false;
      return true;
    });
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
              <button class="btn btn-primary btn-sm" id="btn-new-ticket">+ Nuevo ticket</button>
            </div>
          </header>
          <div class="page-body">

            <!-- Stats rápidas -->
            <div class="stats-grid">
              ${quickStats(mockTickets.filter(t => t.workspaceId === activeWorkspace?.id))}
            </div>

            <!-- Filtros -->
            <div class="card" style="margin-bottom:1rem;padding:1rem">
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

    document.getElementById("btn-new-ticket")?.addEventListener("click", () => openNewTicketModal());
  }

  function bindFilters() {
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
      filters = { status: "", type: "", priority: "", agent: "" };
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

function openNewTicketModal() {
  const overlay = openModal(`
    <div class="modal-header">
      <span class="modal-title">Crear nuevo ticket</span>
      <button class="modal-close" onclick="document.querySelector('.modal-overlay').remove()">×</button>
    </div>
    <form id="new-ticket-form">
      <div class="auth-form" style="gap:.9rem">
        <div class="form-group">
          <label class="form-label">Correo del cliente</label>
          <input class="form-control" type="email" id="nt-email" placeholder="cliente@email.com" required />
        </div>
        <div class="form-group">
          <label class="form-label">Asunto</label>
          <input class="form-control" type="text" id="nt-subject" placeholder="Describe brevemente el problema" required />
        </div>
        <div class="form-group">
          <label class="form-label">Descripción</label>
          <textarea class="form-control" id="nt-desc" rows="3" placeholder="Detalla la situación..."></textarea>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:.8rem">
          <div class="form-group">
            <label class="form-label">Tipo</label>
            <select class="form-control form-select" id="nt-type">
              <option value="P">Petición</option>
              <option value="Q">Queja</option>
              <option value="R">Reclamo</option>
              <option value="S">Sugerencia</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Prioridad</label>
            <select class="form-control form-select" id="nt-priority">
              <option value="LOW">Baja</option>
              <option value="MEDIUM" selected>Media</option>
              <option value="HIGH">Alta</option>
              <option value="URGENT">Urgente</option>
            </select>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline" onclick="document.querySelector('.modal-overlay').remove()">Cancelar</button>
        <button type="submit" class="btn btn-primary">Crear ticket</button>
      </div>
    </form>
  `);

  overlay.querySelector("#new-ticket-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const code = "SUP-" + Date.now();
    toast.success(`Ticket ${code} creado exitosamente`);
    overlay.remove();
  });
}
