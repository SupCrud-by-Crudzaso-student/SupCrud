import { getState, setState } from "../../store/store.js";
import { navigate } from "../../router/router.js";
import { renderSidebar, setupLogout } from "../../components/sidebar.js";
import { mockWorkspaces, mockTickets, saveData } from "../../mocks/data.js";
import { toast } from "../../components/toast.js";

export function renderSettings(container) {
  const { user, role, activeWorkspace } = getState();
  if (!user) { navigate("/login"); return; }
  if (role !== "ADMIN") { navigate(`/workspace/${activeWorkspace?.workspaceKey}`); return; }
  setupLogout();

  const ws = mockWorkspaces.find(w => w.id === activeWorkspace?.id);

  container.innerHTML = `
    <div class="dashboard-layout">
      ${renderSidebar("settings", role)}
      <div class="main-content">
        <header class="topbar">
          <span class="topbar-title">Ajustes del workspace</span>
        </header>
        <div class="page-body">

          <div class="card" style="max-width:520px">
            <div class="card-header"><span class="card-title">Información general</span></div>
            <form id="settings-form" style="display:flex;flex-direction:column;gap:1rem">
              <div class="form-group">
                <label class="form-label">Nombre del workspace</label>
                <input class="form-control" type="text" id="ws-name" value="${ws?.name || ""}" required />
              </div>
              <div class="form-group">
                <label class="form-label">Clave (workspace key)</label>
                <input class="form-control" type="text" value="${ws?.workspaceKey || ""}" disabled
                  style="opacity:.6;cursor:not-allowed" />
                <span style="font-size:.75rem;color:#94a3b8">La clave no se puede cambiar.</span>
              </div>
              <div class="form-group">
                <label class="form-label">Estado</label>
                <input class="form-control" value="${ws?.status === "ACTIVE" ? "Activo" : "Suspendido"}" disabled
                  style="opacity:.6;cursor:not-allowed" />
              </div>
              <button type="submit" class="btn btn-primary" style="align-self:flex-start">Guardar cambios</button>
            </form>
          </div>

          <div class="card" style="max-width:520px;margin-top:1.2rem;border:1px solid #fca5a5">
            <div class="card-header"><span class="card-title" style="color:#dc2626">Zona de peligro</span></div>
            <p style="font-size:.85rem;color:#64748b;margin-bottom:.8rem">
              Estas acciones son irreversibles. Procede con cuidado.
            </p>
            <button class="btn btn-danger btn-sm" id="btn-clear-tickets">Limpiar todos los tickets</button>
          </div>

        </div>
      </div>
    </div>
  `;

  document.getElementById("settings-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const newName = document.getElementById("ws-name").value.trim();
    if (!newName || !ws) return;
    ws.name = newName;
    saveData();
    setState({ activeWorkspace: { ...activeWorkspace, name: newName } });
    toast.success("Cambios guardados correctamente");
  });

  document.getElementById("btn-clear-tickets").addEventListener("click", () => {
    if (!confirm("¿Eliminar TODOS los tickets de este workspace? Esta acción no se puede deshacer.")) return;
    const toRemove = mockTickets.filter(t => t.workspaceId === activeWorkspace?.id);
    toRemove.forEach(t => {
      const idx = mockTickets.indexOf(t);
      if (idx !== -1) mockTickets.splice(idx, 1);
    });
    saveData();
    toast.success(`${toRemove.length} ticket(s) eliminados`);
  });
}
