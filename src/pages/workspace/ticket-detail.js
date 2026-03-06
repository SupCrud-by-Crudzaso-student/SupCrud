import { getState } from "../../store/store.js";
import { navigate } from "../../router/router.js";
import { renderSidebar, setupLogout } from "../../components/sidebar.js";
import { mockTickets, mockMessages, mockEvents, mockMembers } from "../../mocks/data.js";
import { statusBadge, priorityBadge, typeBadge, formatDate, formatDateTime, avatarHTML } from "../../components/helpers.js";
import { toast } from "../../components/toast.js";

export function renderTicketDetail(container, { ticketId }) {
  const { user, role, activeWorkspace } = getState();
  if (!user) { navigate("/login"); return; }
  setupLogout();

  const ticket = mockTickets.find(t => t.id === ticketId);
  if (!ticket) {
    container.innerHTML = `<div style="padding:3rem;text-align:center"><h2>Ticket no encontrado</h2><button class="btn btn-primary" onclick="navigate('/workspace/${activeWorkspace?.workspaceKey}')">Volver</button></div>`;
    return;
  }

  const messages = mockMessages[ticketId] || [];
  const events   = mockEvents[ticketId]   || [];

  function render() {
    container.innerHTML = `
      <div class="dashboard-layout">
        ${renderSidebar("tickets", role)}
        <div class="main-content">
          <header class="topbar">
            <button class="btn btn-ghost btn-sm" onclick="navigate('/workspace/${activeWorkspace?.workspaceKey}')">← Volver</button>
            <span class="topbar-title" style="font-size:.95rem">${ticket.referenceCode} — ${ticket.subject}</span>
            <div class="topbar-actions">
              ${statusBadge(ticket.status)}
            </div>
          </header>
          <div class="page-body">
            <div class="detail-grid">

              <!-- Conversación -->
              <div style="display:flex;flex-direction:column;gap:1.2rem">
                <!-- Mensajes -->
                <div class="card">
                  <div class="card-header">
                    <span class="card-title">Conversación</span>
                  </div>
                  <div class="messages-list" id="messages-list">
                    ${messages.length === 0
                      ? `<p class="text-muted" style="font-size:.88rem">Sin mensajes aún.</p>`
                      : messages.map(m => `
                          <div style="display:flex;flex-direction:column;align-items:${m.isAgent ? "flex-end" : "flex-start"}">
                            <div class="message-bubble ${m.isAgent ? "agent" : "user"}">${m.content}</div>
                            <div class="message-meta">${m.authorName || m.authorEmail} · ${formatDateTime(m.createdAt)}</div>
                          </div>
                        `).join("")
                    }
                  </div>
                  <div class="reply-box" style="margin-top:1rem">
                    <textarea class="form-control" id="reply-input" placeholder="Escribe una respuesta..." rows="3"></textarea>
                    <button class="btn btn-primary btn-sm" style="align-self:flex-end" id="btn-reply">Enviar</button>
                  </div>
                </div>

                <!-- Historial de eventos -->
                <div class="card">
                  <div class="card-header"><span class="card-title">Historial de eventos</span></div>
                  ${events.length === 0
                    ? `<p class="text-muted" style="font-size:.88rem">Sin eventos registrados.</p>`
                    : `<div style="display:flex;flex-direction:column;gap:.6rem">
                        ${events.map(ev => `
                          <div style="display:flex;align-items:center;gap:.7rem;font-size:.84rem">
                            <div style="width:8px;height:8px;border-radius:50%;background:#6366f1;flex-shrink:0"></div>
                            <div>
                              <span style="font-weight:600">${ev.type}</span> — ${ev.description}
                              ${ev.performedBy ? `<span class="text-muted"> por ${ev.performedBy}</span>` : ""}
                              <div class="text-muted" style="font-size:.76rem">${formatDateTime(ev.createdAt)}</div>
                            </div>
                          </div>
                        `).join("")}
                      </div>`
                  }
                </div>
              </div>

              <!-- Panel lateral derecho -->
              <div style="display:flex;flex-direction:column;gap:1.2rem">

                <!-- Info del ticket -->
                <div class="card">
                  <div class="card-header"><span class="card-title">Información</span></div>
                  <div>
                    <div class="info-row"><span class="label">Código</span><code style="font-size:.8rem;color:#6366f1">${ticket.referenceCode}</code></div>
                    <div class="info-row"><span class="label">Tipo</span>${typeBadge(ticket.type)}</div>
                    <div class="info-row"><span class="label">Estado</span>${statusBadge(ticket.status)}</div>
                    <div class="info-row"><span class="label">Prioridad</span>${priorityBadge(ticket.priority)}</div>
                    <div class="info-row"><span class="label">Email</span><span style="font-size:.83rem">${ticket.email}</span></div>
                    <div class="info-row"><span class="label">Creado</span><span style="font-size:.83rem">${formatDate(ticket.createdAt)}</span></div>
                    <div class="info-row"><span class="label">Actualizado</span><span style="font-size:.83rem">${formatDate(ticket.updatedAt)}</span></div>
                  </div>
                </div>

                <!-- Cambiar estado -->
                <div class="card">
                  <div class="card-header"><span class="card-title">Estado</span></div>
                  <select class="form-control form-select" id="sel-status">
                    ${["OPEN","IN_PROGRESS","RESOLVED","CLOSED","REOPENED"].map(s =>
                      `<option value="${s}" ${ticket.status === s ? "selected" : ""}>${{ OPEN:"Abierto", IN_PROGRESS:"En progreso", RESOLVED:"Resuelto", CLOSED:"Cerrado", REOPENED:"Reabierto" }[s]}</option>`
                    ).join("")}
                  </select>
                  <button class="btn btn-primary btn-sm w-full" style="margin-top:.6rem;justify-content:center" id="btn-update-status">Actualizar estado</button>
                </div>

                <!-- Asignación -->
                <div class="card">
                  <div class="card-header"><span class="card-title">Asignación</span></div>
                  ${ticket.assignedAgent
                    ? `<div style="display:flex;align-items:center;gap:.6rem;margin-bottom:.8rem">
                        ${avatarHTML(ticket.assignedAgent)}
                        <span style="font-size:.88rem;font-weight:600">${ticket.assignedAgent}</span>
                      </div>`
                    : `<p class="text-muted" style="font-size:.85rem;margin-bottom:.8rem">Sin asignar</p>`
                  }
                  <select class="form-control form-select" id="sel-agent">
                    <option value="">Sin asignar</option>
                    ${mockMembers.filter(m => m.role === "AGENT").map(m =>
                      `<option value="${m.userId}" ${ticket.assignedAgentId === m.userId ? "selected" : ""}>${m.name}</option>`
                    ).join("")}
                  </select>
                  <button class="btn btn-outline btn-sm w-full" style="margin-top:.6rem;justify-content:center" id="btn-assign">Asignar agente</button>
                </div>

                <!-- Tags/Categoría -->
                ${ticket.tags?.length ? `
                  <div class="card">
                    <div class="card-header"><span class="card-title">Etiquetas</span></div>
                    <div style="display:flex;flex-wrap:wrap;gap:.4rem">
                      ${ticket.tags.map(tag => `<span class="badge badge-closed">${tag}</span>`).join("")}
                    </div>
                    ${ticket.category ? `<p style="font-size:.8rem;color:#64748b;margin-top:.6rem">Categoría: <strong>${ticket.category}</strong></p>` : ""}
                  </div>
                ` : ""}

              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById("btn-reply")?.addEventListener("click", () => {
      const input = document.getElementById("reply-input");
      if (!input.value.trim()) return;
      toast.success("Respuesta enviada");
      input.value = "";
    });

    document.getElementById("btn-update-status")?.addEventListener("click", () => {
      const status = document.getElementById("sel-status").value;
      toast.success(`Estado actualizado a: ${status}`);
    });

    document.getElementById("btn-assign")?.addEventListener("click", () => {
      const agentId = document.getElementById("sel-agent").value;
      const agent = mockMembers.find(m => m.userId === agentId);
      toast.success(agent ? `Ticket asignado a ${agent.name}` : "Asignación removida");
    });
  }

  render();
}
