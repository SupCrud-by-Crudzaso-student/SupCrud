import { getState } from "../../store/store.js";
import { navigate } from "../../router/router.js";
import { renderSidebar, setupLogout } from "../../components/sidebar.js";
import { mockWorkspaces, mockMetrics } from "../../mocks/data.js";
import { workspaceStatusBadge, formatDate, openModal } from "../../components/helpers.js";
import { toast } from "../../components/toast.js";

export function renderOwner(container) {
  const { user, role } = getState();
  if (!user || role !== "OWNER") { navigate("/login"); return; }
  setupLogout();

  let workspaces = [...mockWorkspaces];

  function render() {
    container.innerHTML = `
      <div class="dashboard-layout">
        ${renderSidebar("workspaces", "OWNER")}
        <div class="main-content">
          <header class="topbar">
            <span class="topbar-title">Panel Global — Workspaces</span>
          </header>
          <div class="page-body">

            <div class="stats-grid">
              <div class="stat-card"><div class="stat-icon purple"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8m-4-4v4"/></svg></div><div><div class="stat-label">Total workspaces</div><div class="stat-value">${workspaces.length}</div></div></div>
              <div class="stat-card"><div class="stat-icon green"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg></div><div><div class="stat-label">Activos</div><div class="stat-value">${workspaces.filter(w => w.status === "ACTIVE").length}</div></div></div>
              <div class="stat-card"><div class="stat-icon orange"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div><div><div class="stat-label">Suspendidos</div><div class="stat-value">${workspaces.filter(w => w.status === "SUSPENDED").length}</div></div></div>
              <div class="stat-card"><div class="stat-icon blue"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/></svg></div><div><div class="stat-label">Total tickets</div><div class="stat-value">${mockMetrics.reduce((s, m) => s + m.totalTickets, 0)}</div></div></div>
            </div>

            <div class="card" style="padding:0">
              <div class="card-header" style="padding:1.2rem 1.5rem;border-bottom:1px solid var(--border)">
                <span class="card-title">Todos los workspaces</span>
              </div>
              <div class="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Workspace</th>
                      <th>Clave</th>
                      <th>Estado</th>
                      <th>Add-ons activos</th>
                      <th>Tickets</th>
                      <th>Abiertos</th>
                      <th>Creado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${workspaces.map(ws => {
                      const m = mockMetrics.find(x => x.workspaceId === ws.id) || {};
                      return `
                        <tr>
                          <td style="font-weight:600">${ws.name}</td>
                          <td><code style="font-size:.78rem;color:#6366f1">${ws.workspaceKey}</code></td>
                          <td>${workspaceStatusBadge(ws.status)}</td>
                          <td>${(m.activeAddons || []).map(a => `<span class="badge badge-open" style="margin-right:.2rem;font-size:.7rem">${a}</span>`).join("") || "<span class='text-muted' style='font-size:.82rem'>Ninguno</span>"}</td>
                          <td>${m.totalTickets ?? 0}</td>
                          <td>${m.openTickets ?? 0}</td>
                          <td style="font-size:.82rem;color:#64748b">${formatDate(ws.createdAt)}</td>
                          <td>
                            <button class="btn btn-sm ${ws.status === "ACTIVE" ? "btn-danger" : "btn-primary"}"
                              onclick="toggleWorkspace('${ws.id}')">
                              ${ws.status === "ACTIVE" ? "Suspender" : "Reactivar"}
                            </button>
                          </td>
                        </tr>
                      `;
                    }).join("")}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>
    `;

    window.toggleWorkspace = (id) => {
      const ws = workspaces.find(w => w.id === id);
      if (!ws) return;
      ws.status = ws.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
      toast.success(`Workspace ${ws.name} ${ws.status === "ACTIVE" ? "reactivado" : "suspendido"}`);
      render();
    };
  }

  render();
}
