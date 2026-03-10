import { getState } from "../../store/store.js";
import { navigate } from "../../router/router.js";
import { renderSidebar, setupLogout } from "../../components/sidebar.js";
import { mockWorkspaces, mockAddons, saveData } from "../../mocks/data.js";
import { toast } from "../../components/toast.js";

export function renderAddons(container) {
  const { user, role, activeWorkspace } = getState();
  if (!user) { navigate("/login"); return; }
  if (role !== "ADMIN") { navigate(`/workspace/${activeWorkspace?.workspaceKey}`); return; }
  setupLogout();

  function render() {
    const ws = mockWorkspaces.find(w => w.id === activeWorkspace?.id);
    const activeKeys = ws?.addons || [];

    container.innerHTML = `
      <div class="dashboard-layout">
        ${renderSidebar("addons", role)}
        <div class="main-content">
          <header class="topbar">
            <span class="topbar-title">Add-ons</span>
            <div class="topbar-actions">
              <span style="font-size:.82rem;color:#64748b">${activeWorkspace?.name}</span>
            </div>
          </header>
          <div class="page-body">

            <div class="stats-grid" style="margin-bottom:1.5rem">
              <div class="stat-card"><div class="stat-icon purple"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></div><div><div class="stat-label">Add-ons disponibles</div><div class="stat-value">${mockAddons.length}</div></div></div>
              <div class="stat-card"><div class="stat-icon green"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg></div><div><div class="stat-label">Activos</div><div class="stat-value">${activeKeys.length}</div></div></div>
            </div>

            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.2rem">
              ${mockAddons.map(addon => {
                const isActive = activeKeys.includes(addon.key);
                return `
                  <div class="card" style="display:flex;flex-direction:column;gap:.8rem">
                    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:.5rem">
                      <div>
                        <div style="font-weight:700;font-size:.95rem;margin-bottom:.3rem">${addon.name}</div>
                        <div style="font-size:.82rem;color:#64748b">${addon.description}</div>
                      </div>
                      <span class="badge ${isActive ? "badge-resolved" : "badge-closed"}" style="white-space:nowrap;flex-shrink:0">
                        ${isActive ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                    <button class="btn ${isActive ? "btn-danger" : "btn-primary"} btn-sm"
                      onclick="toggleAddon('${addon.key}')">
                      ${isActive ? "Desactivar" : "Activar"}
                    </button>
                  </div>
                `;
              }).join("")}
            </div>

          </div>
        </div>
      </div>
    `;

    window.toggleAddon = (key) => {
      const ws = mockWorkspaces.find(w => w.id === activeWorkspace?.id);
      if (!ws) return;
      const idx = ws.addons.indexOf(key);
      if (idx === -1) {
        ws.addons.push(key);
        toast.success(`Add-on activado`);
      } else {
        ws.addons.splice(idx, 1);
        toast.success(`Add-on desactivado`);
      }
      saveData();
      render();
    };
  }

  render();
}
