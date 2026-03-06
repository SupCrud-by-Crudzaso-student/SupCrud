import { getState, setState } from "../store/store.js";
import { navigate } from "../router/router.js";
import { avatarHTML } from "../components/helpers.js";

export function renderSelectWorkspace(container) {
  const { user, workspaces } = getState();

  if (!user) { navigate("/login"); return; }
  if (!workspaces || workspaces.length === 0) {
    navigate("/login");
    return;
  }

  container.innerHTML = `
    <div class="ws-selector-page">
      <div class="card ws-selector-card">
        <div style="display:flex;align-items:center;gap:.8rem;margin-bottom:.5rem">
          ${avatarHTML(user.name, "avatar-lg")}
          <div>
            <h2>Selecciona un workspace</h2>
            <p class="text-muted" style="font-size:.85rem">${user.email}</p>
          </div>
        </div>
        <p class="text-muted" style="font-size:.88rem">Tienes acceso a múltiples workspaces. Elige con cuál quieres trabajar.</p>

        <div class="ws-list">
          ${workspaces.map(ws => `
            <div class="ws-item" onclick="selectWorkspace('${ws.id}', '${ws.workspaceKey}')">
              <div class="avatar" style="background:#6366f1">${ws.name[0].toUpperCase()}</div>
              <div>
                <div class="ws-item-name">${ws.name}</div>
                <div class="ws-item-key">${ws.workspaceKey} · ${ws.status === "ACTIVE" ? "Activo" : "Suspendido"}</div>
              </div>
              <svg style="margin-left:auto;color:#94a3b8" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
            </div>
          `).join("")}
        </div>

        <button class="btn btn-ghost btn-sm" style="margin-top:1.5rem" onclick="logoutUser()">← Cerrar sesión</button>
      </div>
    </div>
  `;

  window.selectWorkspace = (id, key) => {
    const { workspaces } = getState();
    const ws = workspaces.find(w => w.id === id);
    if (!ws) return;
    setState({ activeWorkspace: ws });
    navigate(`/workspace/${key}`);
  };
}
