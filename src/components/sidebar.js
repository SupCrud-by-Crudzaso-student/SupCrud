import { getState, setState } from "../store/store.js";
import { navigate } from "../router/router.js";
import { initials } from "./helpers.js";

export function renderSidebar(activeSection = "tickets", role = "ADMIN") {
  const { user, activeWorkspace } = getState();
  const wsKey = activeWorkspace?.workspaceKey || "";

  const agentLinks = [
    { id: "tickets",  label: "Tickets",  icon: ticketSVG(),  path: `/workspace/${wsKey}` },
    { id: "metrics",  label: "Métricas", icon: metricsSVG(), path: `/workspace/${wsKey}/metrics` },
  ];

  const adminLinks = [
    { id: "tickets",  label: "Tickets",  icon: ticketSVG(),  path: `/workspace/${wsKey}` },
    { id: "metrics",  label: "Métricas", icon: metricsSVG(), path: `/workspace/${wsKey}/metrics` },
    { id: "agents",   label: "Agentes",  icon: agentSVG(),   path: `/workspace/${wsKey}/agents` },
    { id: "addons",   label: "Add-ons",  icon: addonSVG(),   path: `/workspace/${wsKey}/addons` },
    { id: "settings", label: "Ajustes",  icon: settingsSVG(),path: `/workspace/${wsKey}/settings` },
  ];

  const ownerLinks = [
    { id: "workspaces", label: "Workspaces", icon: workspaceSVG(), path: `/owner` },
    { id: "addons",     label: "Catálogo",   icon: addonSVG(),     path: `/owner/addons` },
    { id: "metrics",    label: "Métricas",   icon: metricsSVG(),   path: `/owner/metrics` },
  ];

  const links = role === "OWNER" ? ownerLinks : role === "ADMIN" ? adminLinks : agentLinks;
  const brandSub = role === "OWNER" ? "Panel Global" : activeWorkspace?.name || "Workspace";

  return `
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-brand">
        <h2>SupCrud</h2>
        <span>${brandSub}</span>
      </div>
      <nav class="sidebar-nav">
        <div class="sidebar-section-label">Menú</div>
        ${links.map(l => `
          <a class="sidebar-link ${activeSection === l.id ? "active" : ""}"
             onclick="navigate('${l.path}')">
            ${l.icon} ${l.label}
          </a>
        `).join("")}
      </nav>
      <div class="sidebar-footer">
        <div class="sidebar-user">
          <div class="avatar">${initials(user?.name || "U")}</div>
          <div class="sidebar-user-info">
            <div class="sidebar-user-name">${user?.name || "Usuario"}</div>
            <div class="sidebar-user-role">${role}</div>
          </div>
        </div>
        <div style="display:flex;gap:.4rem;margin-top:.6rem">
          <button class="btn btn-ghost btn-sm" id="btn-dark-mode"
            style="flex:0 0 auto;color:rgba(255,255,255,.5);padding:.35rem .6rem"
            title="Alternar modo oscuro">
            ${darkModeSVG()}
          </button>
          <button class="btn btn-ghost btn-sm" style="flex:1;color:rgba(255,255,255,.5);justify-content:center" onclick="logoutUser()">
            Cerrar sesión
          </button>
        </div>
      </div>
    </aside>
  `;
}

export function setupLogout() {
  window.logoutUser = () => {
    setState({ user: null, role: null, activeWorkspace: null, workspaces: [] });
    localStorage.removeItem("supcrud-session");
    navigate("/login");
  };

  // Restaurar modo oscuro guardado
  if (localStorage.getItem("supcrud-dark") === "1") {
    document.body.classList.add("dark");
  }

  // Bind del botón de modo oscuro (se renderiza después de esta llamada)
  requestAnimationFrame(() => {
    document.getElementById("btn-dark-mode")?.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      localStorage.setItem("supcrud-dark", document.body.classList.contains("dark") ? "1" : "0");
    });
  });
}

// ─── SVG íconos ──────────────────────────────────────────────────────────────
function ticketSVG() { return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/></svg>`; }
function agentSVG()  { return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`; }
function addonSVG()  { return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`; }
function settingsSVG(){ return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`; }
function workspaceSVG(){ return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8m-4-4v4"/></svg>`; }
function metricsSVG(){ return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`; }
function darkModeSVG(){ return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`; }
