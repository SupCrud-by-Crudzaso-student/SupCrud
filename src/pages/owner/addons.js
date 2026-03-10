import { getState } from "../../store/store.js";
import { navigate } from "../../router/router.js";
import { renderSidebar, setupLogout } from "../../components/sidebar.js";
import { mockAddons, mockWorkspaces, saveData } from "../../mocks/data.js";
import { toast } from "../../components/toast.js";

export function renderOwnerAddons(container) {
  const { user, role } = getState();
  if (!user || role !== "OWNER") { navigate("/login"); return; }
  setupLogout();

  function render() {
    container.innerHTML = `
      <div class="dashboard-layout">
        ${renderSidebar("addons", "OWNER")}
        <div class="main-content">
          <header class="topbar">
            <span class="topbar-title">Catálogo de Add-ons</span>
          </header>
          <div class="page-body">

            <div class="card" style="padding:0">
              <div class="card-header" style="padding:1.2rem 1.5rem;border-bottom:1px solid var(--border)">
                <span class="card-title">Add-ons por workspace</span>
              </div>
              <div class="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Workspace</th>
                      ${mockAddons.map(a => `<th>${a.name}</th>`).join("")}
                    </tr>
                  </thead>
                  <tbody>
                    ${mockWorkspaces.map(ws => `
                      <tr>
                        <td style="font-weight:600">${ws.name}</td>
                        ${mockAddons.map(addon => {
                          const isActive = ws.addons.includes(addon.key);
                          return `
                            <td>
                              <button class="btn btn-sm ${isActive ? "btn-danger" : "btn-outline"}"
                                onclick="toggleWsAddon('${ws.id}','${addon.key}')">
                                ${isActive ? "Desactivar" : "Activar"}
                              </button>
                            </td>
                          `;
                        }).join("")}
                      </tr>
                    `).join("")}
                  </tbody>
                </table>
              </div>
            </div>

            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.2rem;margin-top:1.2rem">
              ${mockAddons.map(addon => `
                <div class="card">
                  <div style="font-weight:700;font-size:.95rem;margin-bottom:.4rem">${addon.name}</div>
                  <div style="font-size:.83rem;color:#64748b;margin-bottom:.6rem">${addon.description}</div>
                  <div style="font-size:.78rem;color:#94a3b8">
                    Activo en: <strong>${mockWorkspaces.filter(w => w.addons.includes(addon.key)).length}</strong> workspace(s)
                  </div>
                </div>
              `).join("")}
            </div>

          </div>
        </div>
      </div>
    `;

    window.toggleWsAddon = (wsId, addonKey) => {
      const ws = mockWorkspaces.find(w => w.id === wsId);
      if (!ws) return;
      const idx = ws.addons.indexOf(addonKey);
      if (idx === -1) {
        ws.addons.push(addonKey);
        toast.success(`Add-on activado en ${ws.name}`);
      } else {
        ws.addons.splice(idx, 1);
        toast.success(`Add-on desactivado en ${ws.name}`);
      }
      saveData();
      render();
    };
  }

  render();
}
