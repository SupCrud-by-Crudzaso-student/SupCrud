import { getState } from "../../store/store.js";
import { navigate } from "../../router/router.js";
import { renderSidebar, setupLogout } from "../../components/sidebar.js";
import { mockTickets } from "../../mocks/data.js";

export function renderMetrics(container) {
  const { user, role, activeWorkspace } = getState();
  if (!user) { navigate("/login"); return; }
  setupLogout();

  const tickets = mockTickets.filter(t => t.workspaceId === activeWorkspace?.id);

  // ── Conteos por estado
  const byStatus = {
    OPEN:        tickets.filter(t => t.status === "OPEN").length,
    IN_PROGRESS: tickets.filter(t => t.status === "IN_PROGRESS").length,
    RESOLVED:    tickets.filter(t => t.status === "RESOLVED").length,
    CLOSED:      tickets.filter(t => t.status === "CLOSED").length,
    REOPENED:    tickets.filter(t => t.status === "REOPENED").length,
  };

  // ── Conteos por tipo
  const byType = {
    P: tickets.filter(t => t.type === "P").length,
    Q: tickets.filter(t => t.type === "Q").length,
    R: tickets.filter(t => t.type === "R").length,
    S: tickets.filter(t => t.type === "S").length,
  };

  // ── Conteos por prioridad
  const byPriority = {
    LOW:    tickets.filter(t => t.priority === "LOW").length,
    MEDIUM: tickets.filter(t => t.priority === "MEDIUM").length,
    HIGH:   tickets.filter(t => t.priority === "HIGH").length,
    URGENT: tickets.filter(t => t.priority === "URGENT").length,
  };

  // ── Tickets por agente
  const agentMap = {};
  tickets.forEach(t => {
    const name = t.assignedAgent || "Sin asignar";
    agentMap[name] = (agentMap[name] || 0) + 1;
  });
  const agentEntries = Object.entries(agentMap).sort((a, b) => b[1] - a[1]);

  // ── Tasa de resolución
  const resolved = (byStatus.RESOLVED + byStatus.CLOSED);
  const resolutionRate = tickets.length ? Math.round((resolved / tickets.length) * 100) : 0;

  // ── Últimos 7 días (tickets creados)
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const label = d.toLocaleDateString("es-CO", { weekday: "short", day: "numeric" });
    const count = tickets.filter(t => {
      const td = new Date(t.createdAt);
      return td.toDateString() === d.toDateString();
    }).length;
    return { label, count };
  });

  const maxLast7 = Math.max(...last7.map(d => d.count), 1);

  container.innerHTML = `
    <div class="dashboard-layout">
      ${renderSidebar("metrics", role)}
      <div class="main-content">
        <header class="topbar">
          <span class="topbar-title">Métricas</span>
          <div class="topbar-actions">
            <span style="font-size:.82rem;color:#64748b">${activeWorkspace?.name}</span>
          </div>
        </header>
        <div class="page-body">

          <!-- Resumen rápido -->
          <div class="stats-grid" style="margin-bottom:1.5rem">
            ${summaryCard("Total tickets", tickets.length, "purple", totalSVG())}
            ${summaryCard("Resueltos", resolved, "green", checkSVG())}
            ${summaryCard("Abiertos", byStatus.OPEN + byStatus.REOPENED, "blue", openSVG())}
            ${summaryCard("Tasa resolución", resolutionRate + "%", "orange", rateSVG())}
          </div>

          <!-- Fila de gráficas -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.2rem;margin-bottom:1.2rem">

            <!-- Por estado -->
            <div class="card">
              <div class="card-header"><span class="card-title">Tickets por estado</span></div>
              ${barChart([
                { label: "Abierto",     value: byStatus.OPEN,        color: "#3b82f6" },
                { label: "En progreso", value: byStatus.IN_PROGRESS,  color: "#f59e0b" },
                { label: "Resuelto",    value: byStatus.RESOLVED,     color: "#22c55e" },
                { label: "Cerrado",     value: byStatus.CLOSED,       color: "#94a3b8" },
                { label: "Reabierto",   value: byStatus.REOPENED,     color: "#ec4899" },
              ])}
            </div>

            <!-- Por prioridad -->
            <div class="card">
              <div class="card-header"><span class="card-title">Tickets por prioridad</span></div>
              ${barChart([
                { label: "Baja",    value: byPriority.LOW,    color: "#22c55e" },
                { label: "Media",   value: byPriority.MEDIUM, color: "#eab308" },
                { label: "Alta",    value: byPriority.HIGH,   color: "#f97316" },
                { label: "Urgente", value: byPriority.URGENT, color: "#ef4444" },
              ])}
            </div>

          </div>

          <!-- Fila inferior -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.2rem">

            <!-- Actividad últimos 7 días -->
            <div class="card">
              <div class="card-header"><span class="card-title">Actividad últimos 7 días</span></div>
              <div style="display:flex;align-items:flex-end;gap:.5rem;height:120px;padding-top:.5rem">
                ${last7.map(d => `
                  <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:.3rem">
                    <span style="font-size:.7rem;font-weight:700;color:#6366f1">${d.count || ""}</span>
                    <div style="width:100%;background:#6366f1;border-radius:4px 4px 0 0;height:${Math.round((d.count / maxLast7) * 90)}px;min-height:${d.count ? 8 : 2}px;transition:height .3s"></div>
                    <span style="font-size:.65rem;color:#94a3b8;text-align:center;line-height:1.2">${d.label}</span>
                  </div>
                `).join("")}
              </div>
            </div>

            <!-- Por tipo -->
            <div class="card">
              <div class="card-header"><span class="card-title">Tickets por tipo (PQRS)</span></div>
              ${donutChart([
                { label: "Petición",    value: byType.P, color: "#6366f1" },
                { label: "Queja",       value: byType.Q, color: "#ec4899" },
                { label: "Reclamo",     value: byType.R, color: "#f97316" },
                { label: "Sugerencia",  value: byType.S, color: "#22c55e" },
              ], tickets.length)}
            </div>

          </div>

          <!-- Tabla de agentes -->
          <div class="card" style="margin-top:1.2rem">
            <div class="card-header"><span class="card-title">Tickets por agente</span></div>
            <div class="table-wrapper">
              <table>
                <thead><tr><th>Agente</th><th>Tickets asignados</th><th>Distribución</th></tr></thead>
                <tbody>
                  ${agentEntries.map(([name, count]) => {
                    const pct = Math.round((count / tickets.length) * 100);
                    return `<tr>
                      <td style="font-weight:600;font-size:.88rem">${name}</td>
                      <td style="font-size:.88rem">${count}</td>
                      <td style="width:200px">
                        <div style="display:flex;align-items:center;gap:.5rem">
                          <div style="flex:1;height:8px;background:#e2e8f0;border-radius:999px;overflow:hidden">
                            <div style="width:${pct}%;height:100%;background:#6366f1;border-radius:999px"></div>
                          </div>
                          <span style="font-size:.75rem;color:#64748b;min-width:2.5rem">${pct}%</span>
                        </div>
                      </td>
                    </tr>`;
                  }).join("")}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  `;
}

// ─── Helpers de componentes ───────────────────────────────────────────────────

function summaryCard(label, value, color, icon) {
  return `<div class="stat-card"><div class="stat-icon ${color}">${icon}</div><div><div class="stat-label">${label}</div><div class="stat-value">${value}</div></div></div>`;
}

function barChart(items) {
  const max = Math.max(...items.map(i => i.value), 1);
  return `<div style="display:flex;flex-direction:column;gap:.7rem">
    ${items.map(item => `
      <div style="display:flex;align-items:center;gap:.75rem;font-size:.83rem">
        <span style="min-width:90px;color:#334155">${item.label}</span>
        <div style="flex:1;height:14px;background:#f1f5f9;border-radius:999px;overflow:hidden">
          <div style="width:${Math.round((item.value / max) * 100)}%;height:100%;background:${item.color};border-radius:999px;transition:width .4s ease"></div>
        </div>
        <span style="min-width:24px;text-align:right;font-weight:700;color:#0f172a">${item.value}</span>
      </div>
    `).join("")}
  </div>`;
}

function donutChart(items, total) {
  if (total === 0) return `<p class="text-muted" style="font-size:.85rem">Sin datos.</p>`;
  return `
    <div style="display:flex;align-items:center;gap:1.5rem">
      <div style="position:relative;width:100px;height:100px;flex-shrink:0">
        <svg viewBox="0 0 36 36" style="width:100%;height:100%;transform:rotate(-90deg)">
          ${(() => {
            let offset = 0;
            return items.map(item => {
              const pct = (item.value / total) * 100;
              const seg = `<circle cx="18" cy="18" r="15.9" fill="none" stroke="${item.color}" stroke-width="3.8"
                stroke-dasharray="${pct} ${100 - pct}" stroke-dashoffset="${-offset}" />`;
              offset += pct;
              return seg;
            }).join("");
          })()}
        </svg>
        <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:1.1rem;color:#0f172a">${total}</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:.45rem">
        ${items.map(item => `
          <div style="display:flex;align-items:center;gap:.45rem;font-size:.82rem">
            <div style="width:10px;height:10px;border-radius:2px;background:${item.color};flex-shrink:0"></div>
            <span style="color:#334155">${item.label}</span>
            <span style="font-weight:700;color:#0f172a;margin-left:.25rem">${item.value}</span>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

// ─── SVG íconos ───────────────────────────────────────────────────────────────
function totalSVG()  { return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/></svg>`; }
function checkSVG()  { return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`; }
function openSVG()   { return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`; }
function rateSVG()   { return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`; }
