import { getState } from "../../store/store.js";
import { navigate } from "../../router/router.js";
import { renderSidebar, setupLogout } from "../../components/sidebar.js";
import { mockTickets, mockWorkspaces } from "../../mocks/data.js";

export function renderOwnerMetrics(container) {
  const { user, role } = getState();
  if (!user || role !== "OWNER") { navigate("/login"); return; }
  setupLogout();

  const total = mockTickets.length;
  const open  = mockTickets.filter(t => t.status === "OPEN" || t.status === "REOPENED").length;
  const resolved = mockTickets.filter(t => t.status === "RESOLVED" || t.status === "CLOSED").length;
  const rate = total ? Math.round((resolved / total) * 100) : 0;

  const byWorkspace = mockWorkspaces.map(ws => {
    const wt = mockTickets.filter(t => t.workspaceId === ws.id);
    return {
      name: ws.name,
      total: wt.length,
      open: wt.filter(t => t.status === "OPEN" || t.status === "REOPENED").length,
      resolved: wt.filter(t => t.status === "RESOLVED" || t.status === "CLOSED").length,
    };
  });

  const maxTotal = Math.max(...byWorkspace.map(w => w.total), 1);

  container.innerHTML = `
    <div class="dashboard-layout">
      ${renderSidebar("metrics", "OWNER")}
      <div class="main-content">
        <header class="topbar">
          <span class="topbar-title">Métricas Globales</span>
        </header>
        <div class="page-body">

          <div class="stats-grid" style="margin-bottom:1.5rem">
            <div class="stat-card"><div class="stat-icon purple"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/></svg></div><div><div class="stat-label">Total tickets</div><div class="stat-value">${total}</div></div></div>
            <div class="stat-card"><div class="stat-icon blue"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div><div><div class="stat-label">Abiertos</div><div class="stat-value">${open}</div></div></div>
            <div class="stat-card"><div class="stat-icon green"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg></div><div><div class="stat-label">Resueltos</div><div class="stat-value">${resolved}</div></div></div>
            <div class="stat-card"><div class="stat-icon orange"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg></div><div><div class="stat-label">Tasa resolución</div><div class="stat-value">${rate}%</div></div></div>
          </div>

          <div class="card">
            <div class="card-header"><span class="card-title">Tickets por workspace</span></div>
            <div style="display:flex;flex-direction:column;gap:1rem">
              ${byWorkspace.map(w => `
                <div>
                  <div style="display:flex;justify-content:space-between;font-size:.88rem;margin-bottom:.3rem">
                    <span style="font-weight:600">${w.name}</span>
                    <span style="color:#64748b">${w.total} tickets · ${w.open} abiertos · ${w.resolved} resueltos</span>
                  </div>
                  <div style="height:12px;background:#f1f5f9;border-radius:999px;overflow:hidden">
                    <div style="width:${Math.round((w.total / maxTotal) * 100)}%;height:100%;background:#6366f1;border-radius:999px"></div>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>

        </div>
      </div>
    </div>
  `;
}
