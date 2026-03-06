import { getState } from "../../store/store.js";
import { navigate } from "../../router/router.js";
import { renderSidebar, setupLogout } from "../../components/sidebar.js";
import { mockMembers } from "../../mocks/data.js";
import { avatarHTML, openModal } from "../../components/helpers.js";
import { toast } from "../../components/toast.js";

export function renderAgents(container) {
  const { user, role, activeWorkspace } = getState();
  if (!user) { navigate("/login"); return; }
  if (role !== "ADMIN") { navigate(`/workspace/${activeWorkspace?.workspaceKey}`); return; }
  setupLogout();

  const members = mockMembers.filter(m => m.workspaceId === activeWorkspace?.id);

  container.innerHTML = `
    <div class="dashboard-layout">
      ${renderSidebar("agents", role)}
      <div class="main-content">
        <header class="topbar">
          <span class="topbar-title">Agentes</span>
          <div class="topbar-actions">
            <button class="btn btn-primary btn-sm" id="btn-invite">+ Invitar agente</button>
          </div>
        </header>
        <div class="page-body">

          <div class="stats-grid">
            <div class="stat-card"><div class="stat-icon purple"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div><div><div class="stat-label">Total miembros</div><div class="stat-value">${members.length}</div></div></div>
            <div class="stat-card"><div class="stat-icon blue"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg></div><div><div class="stat-label">Admins</div><div class="stat-value">${members.filter(m => m.role === "ADMIN").length}</div></div></div>
            <div class="stat-card"><div class="stat-icon green"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div><div><div class="stat-label">Agentes</div><div class="stat-value">${members.filter(m => m.role === "AGENT").length}</div></div></div>
          </div>

          <div class="card" style="padding:0">
            <div class="card-header" style="padding:1.2rem 1.5rem;border-bottom:1px solid var(--border)">
              <span class="card-title">Miembros del workspace</span>
            </div>
            <div class="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Miembro</th>
                    <th>Correo</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  ${members.map(m => `
                    <tr>
                      <td>
                        <div style="display:flex;align-items:center;gap:.6rem">
                          ${avatarHTML(m.name)}
                          <span style="font-weight:600;font-size:.9rem">${m.name}</span>
                        </div>
                      </td>
                      <td style="font-size:.85rem;color:#64748b">${m.email}</td>
                      <td>
                        <span class="badge ${m.role === "ADMIN" ? "badge-in_progress" : "badge-open"}">${m.role}</span>
                      </td>
                      <td>
                        <div style="display:flex;gap:.4rem">
                          <button class="btn btn-outline btn-sm" onclick="changeRole('${m.id}', '${m.role}')">Cambiar rol</button>
                          <button class="btn btn-danger btn-sm" onclick="removeMember('${m.id}', '${m.name}')">Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById("btn-invite").addEventListener("click", openInviteModal);

  window.changeRole = (id, currentRole) => {
    const newRole = currentRole === "ADMIN" ? "AGENT" : "ADMIN";
    toast.success(`Rol cambiado a ${newRole}`);
  };

  window.removeMember = (id, name) => {
    if (confirm(`¿Eliminar a ${name} del workspace?`)) {
      toast.success(`${name} ha sido removido`);
    }
  };
}

function openInviteModal() {
  const overlay = openModal(`
    <div class="modal-header">
      <span class="modal-title">Invitar agente</span>
      <button class="modal-close" onclick="document.querySelector('.modal-overlay').remove()">×</button>
    </div>
    <form id="invite-form">
      <div style="display:flex;flex-direction:column;gap:1rem">
        <div class="form-group">
          <label class="form-label">Correo electrónico</label>
          <input class="form-control" type="email" id="inv-email" placeholder="agente@empresa.com" required />
        </div>
        <div class="form-group">
          <label class="form-label">Rol</label>
          <select class="form-control form-select" id="inv-role">
            <option value="AGENT">Agente</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        <p class="text-muted" style="font-size:.83rem">Se enviará un correo con el link de invitación con 48h de expiración.</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline" onclick="document.querySelector('.modal-overlay').remove()">Cancelar</button>
        <button type="submit" class="btn btn-primary">Enviar invitación</button>
      </div>
    </form>
  `);

  overlay.querySelector("#invite-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("inv-email").value;
    toast.success(`Invitación enviada a ${email}`);
    overlay.remove();
  });
}
