import { register, start } from "./router/router.js";
import { renderLanding }         from "./pages/landing.js";
import { renderLogin }           from "./pages/login.js";
import { renderSelectWorkspace } from "./pages/select-workspace.js";
import { renderTickets }         from "./pages/workspace/tickets.js";
import { renderTicketDetail }    from "./pages/workspace/ticket-detail.js";
import { renderAgents }          from "./pages/workspace/agents.js";
import { renderOwner }           from "./pages/owner/index.js";
import { renderTrack }           from "./pages/track.js";

// ─── Rutas ───────────────────────────────────────────────────────────────────
register("/",                              (el)         => renderLanding(el));
register("/login",                         (el)         => renderLogin(el));
register("/register",                      (el)         => renderLogin(el));  // placeholder
register("/select-workspace",              (el)         => renderSelectWorkspace(el));
register("/track",                         (el)         => renderTrack(el));

register("/owner",                         (el)         => renderOwner(el));

register("/workspace/:workspaceKey",       (el, params) => renderTickets(el, params));
register("/workspace/:workspaceKey/tickets/:ticketId", (el, params) => renderTicketDetail(el, params));
register("/workspace/:workspaceKey/agents",(el, params) => renderAgents(el, params));

// ─── Arranque ─────────────────────────────────────────────────────────────────
start();
