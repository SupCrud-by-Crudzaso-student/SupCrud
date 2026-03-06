/**
 * SupCrud Widget by Crudzaso
 * Uso: <script src="widget.js" data-workspace="empresa-alpha"></script>
 */
(function () {
  const WORKSPACE_KEY = document.currentScript?.getAttribute("data-workspace") || "demo";
  const PRIMARY = "#6366f1";

  /* ── Estilos ─────────────────────────────────────────────────────────────── */
  const css = `
    #supcrud-btn {
      position: fixed; bottom: 24px; right: 24px; z-index: 9998;
      width: 56px; height: 56px; border-radius: 50%;
      background: ${PRIMARY}; color: #fff; border: none; cursor: pointer;
      box-shadow: 0 4px 20px rgba(99,102,241,.45);
      display: flex; align-items: center; justify-content: center;
      transition: transform .2s, box-shadow .2s;
    }
    #supcrud-btn:hover { transform: scale(1.1); box-shadow: 0 6px 28px rgba(99,102,241,.55); }
    #supcrud-btn svg { pointer-events: none; }

    #supcrud-badge {
      position: absolute; top: -4px; right: -4px;
      background: #ef4444; color: #fff;
      font-size: 10px; font-weight: 700;
      width: 18px; height: 18px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      border: 2px solid #fff;
    }

    #supcrud-panel {
      position: fixed; bottom: 92px; right: 24px; z-index: 9999;
      width: 360px; max-height: 600px;
      background: #fff; border-radius: 16px;
      box-shadow: 0 8px 40px rgba(0,0,0,.18);
      display: flex; flex-direction: column;
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 14px; color: #0f172a;
      overflow: hidden;
      animation: scPanelIn .2s ease;
      transform-origin: bottom right;
    }
    @keyframes scPanelIn {
      from { opacity: 0; transform: scale(.92) translateY(12px); }
    }

    #supcrud-header {
      background: ${PRIMARY}; color: #fff;
      padding: 16px 18px; display: flex; align-items: center; justify-content: space-between;
    }
    #supcrud-header h3 { font-size: 15px; font-weight: 700; margin: 0; }
    #supcrud-header p  { font-size: 11px; opacity: .8; margin: 2px 0 0; }
    #supcrud-close {
      background: rgba(255,255,255,.2); border: none; color: #fff;
      width: 28px; height: 28px; border-radius: 50%; cursor: pointer;
      font-size: 16px; display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    #supcrud-close:hover { background: rgba(255,255,255,.35); }

    #supcrud-tabs {
      display: flex; border-bottom: 1px solid #e2e8f0;
    }
    .sc-tab {
      flex: 1; padding: 10px; text-align: center;
      font-size: 12px; font-weight: 600; cursor: pointer;
      color: #64748b; border: none; background: none;
      border-bottom: 2px solid transparent;
      transition: color .15s, border-color .15s;
    }
    .sc-tab.active { color: ${PRIMARY}; border-bottom-color: ${PRIMARY}; }

    #supcrud-body { flex: 1; overflow-y: auto; padding: 16px; }

    /* Form */
    .sc-form-group { display: flex; flex-direction: column; gap: 4px; margin-bottom: 10px; }
    .sc-label { font-size: 12px; font-weight: 600; color: #374151; }
    .sc-input, .sc-select, .sc-textarea {
      width: 100%; padding: 8px 10px;
      border: 1.5px solid #e2e8f0; border-radius: 8px;
      font-size: 13px; color: #0f172a; font-family: inherit;
      outline: none; background: #fff; box-sizing: border-box;
      transition: border-color .15s;
    }
    .sc-input:focus, .sc-select:focus, .sc-textarea:focus {
      border-color: ${PRIMARY}; box-shadow: 0 0 0 3px rgba(99,102,241,.12);
    }
    .sc-textarea { resize: none; min-height: 80px; }
    .sc-select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 8px center; padding-right: 28px; }

    .sc-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }

    .sc-btn {
      width: 100%; padding: 10px; border-radius: 8px;
      border: none; cursor: pointer; font-size: 13px; font-weight: 600;
      font-family: inherit; transition: background .15s;
    }
    .sc-btn-primary { background: ${PRIMARY}; color: #fff; }
    .sc-btn-primary:hover { background: #4f46e5; }
    .sc-btn-outline { background: transparent; border: 1.5px solid #e2e8f0; color: #374151; }
    .sc-btn-outline:hover { border-color: ${PRIMARY}; color: ${PRIMARY}; }

    .sc-error   { font-size: 11px; color: #ef4444; margin-top: 2px; }
    .sc-success  {
      text-align: center; padding: 20px 10px;
    }
    .sc-success svg { margin: 0 auto 8px; }
    .sc-success h4  { font-size: 15px; font-weight: 700; margin-bottom: 4px; }
    .sc-success p   { font-size: 12px; color: #64748b; }
    .sc-ref-code {
      display: inline-block; margin: 10px 0;
      background: #ede9fe; color: #4f46e5;
      padding: 4px 12px; border-radius: 99px;
      font-weight: 700; font-size: 13px; font-family: monospace;
    }

    /* Track */
    .sc-track-result {
      margin-top: 10px; padding: 12px;
      background: #f8fafc; border-radius: 10px;
      border: 1px solid #e2e8f0;
    }
    .sc-track-result h4 { font-size: 13px; font-weight: 700; margin-bottom: 6px; }
    .sc-info-row { display: flex; justify-content: space-between; font-size: 12px; padding: 4px 0; border-bottom: 1px solid #e2e8f0; }
    .sc-info-row:last-child { border-bottom: none; }
    .sc-info-label { color: #64748b; }
    .sc-badge { display: inline-block; padding: 2px 8px; border-radius: 99px; font-size: 11px; font-weight: 600; }
    .sc-badge-open        { background: #dbeafe; color: #1d4ed8; }
    .sc-badge-in_progress { background: #fef3c7; color: #b45309; }
    .sc-badge-resolved    { background: #dcfce7; color: #15803d; }
    .sc-badge-closed      { background: #f1f5f9; color: #475569; }
    .sc-badge-reopened    { background: #fce7f3; color: #be185d; }

    /* KB */
    .sc-article {
      padding: 10px 0; border-bottom: 1px solid #f1f5f9; cursor: pointer;
    }
    .sc-article:last-child { border-bottom: none; }
    .sc-article h4 { font-size: 13px; font-weight: 600; margin-bottom: 3px; }
    .sc-article p  { font-size: 12px; color: #64748b; }
    .sc-article-detail { display: none; margin-top: 6px; font-size: 12px; color: #475569; line-height: 1.5; }
    .sc-article.open .sc-article-detail { display: block; }

    #supcrud-footer {
      padding: 8px 16px; border-top: 1px solid #f1f5f9;
      font-size: 10px; color: #94a3b8; text-align: center;
    }
    #supcrud-footer strong { color: ${PRIMARY}; }
  `;

  /* ── Datos mock ──────────────────────────────────────────────────────────── */
  const MOCK_TICKETS = [
    { referenceCode: "SUP-2024-001", subject: "No puedo iniciar sesion", status: "OPEN",        type: "Q", updatedAt: "2024-11-01" },
    { referenceCode: "SUP-2024-002", subject: "Solicito factura",        status: "IN_PROGRESS", type: "P", updatedAt: "2024-11-01" },
    { referenceCode: "SUP-2024-003", subject: "Producto danado",         status: "RESOLVED",    type: "R", updatedAt: "2024-10-30" },
  ];

  const MOCK_ARTICLES = [
    { title: "¿Cómo crear un ticket?", summary: "Guía paso a paso para enviar tu solicitud.", body: "Para crear un ticket, accede al formulario, completa tu correo, asunto, descripción y tipo de solicitud. Recibirás un código de referencia en tu correo." },
    { title: "¿Cómo consultar mi ticket?", summary: "Usa tu código de referencia para rastrearlo.", body: "Ingresa tu código de referencia en la pestaña 'Estado'. Podrás ver el estado actual, tipo y última actualización de tu solicitud." },
    { title: "¿Qué significan los estados?", summary: "OPEN, IN_PROGRESS, RESOLVED, CLOSED...", body: "OPEN: recibido. IN_PROGRESS: siendo atendido. RESOLVED: solución aplicada. CLOSED: cerrado definitivamente. REOPENED: reabierto a solicitud." },
  ];

  /* ── Estado interno ──────────────────────────────────────────────────────── */
  let panelOpen = false;
  let activeTab = "create"; // create | track | kb
  let submitted = false;
  let refCode = null;

  /* ── Inyectar CSS ────────────────────────────────────────────────────────── */
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  /* ── Botón flotante ──────────────────────────────────────────────────────── */
  const btn = document.createElement("button");
  btn.id = "supcrud-btn";
  btn.title = "Soporte";
  btn.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
    <div id="supcrud-badge">1</div>
  `;
  btn.addEventListener("click", togglePanel);
  document.body.appendChild(btn);

  /* ── Panel ───────────────────────────────────────────────────────────────── */
  const panel = document.createElement("div");
  panel.id = "supcrud-panel";
  panel.style.display = "none";
  document.body.appendChild(panel);

  function togglePanel() {
    panelOpen = !panelOpen;
    panel.style.display = panelOpen ? "flex" : "none";
    document.getElementById("supcrud-badge").style.display = panelOpen ? "none" : "flex";
    if (panelOpen) renderPanel();
  }

  /* ── Render panel ────────────────────────────────────────────────────────── */
  function renderPanel() {
    panel.innerHTML = `
      <div id="supcrud-header">
        <div>
          <h3>¿En qué podemos ayudarte?</h3>
          <p>Soporte — ${WORKSPACE_KEY}</p>
        </div>
        <button id="supcrud-close">×</button>
      </div>

      <div id="supcrud-tabs">
        <button class="sc-tab ${activeTab === "create" ? "active" : ""}" data-tab="create">Nuevo ticket</button>
        <button class="sc-tab ${activeTab === "track"  ? "active" : ""}" data-tab="track">Estado</button>
        <button class="sc-tab ${activeTab === "kb"     ? "active" : ""}" data-tab="kb">Ayuda</button>
      </div>

      <div id="supcrud-body">
        ${activeTab === "create" ? renderCreate() : ""}
        ${activeTab === "track"  ? renderTrackTab() : ""}
        ${activeTab === "kb"     ? renderKB() : ""}
      </div>

      <div id="supcrud-footer">Powered by <strong>SupCrud by Crudzaso</strong></div>
    `;

    document.getElementById("supcrud-close").addEventListener("click", togglePanel);

    panel.querySelectorAll(".sc-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        activeTab = tab.dataset.tab;
        submitted = false;
        renderPanel();
      });
    });

    bindCreate();
    bindTrack();
    bindKB();
  }

  /* ── Tab: Crear ticket ───────────────────────────────────────────────────── */
  function renderCreate() {
    if (submitted) {
      return `
        <div class="sc-success">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><polyline points="20 6 9 17 4 12"/>
          </svg>
          <h4>¡Ticket enviado!</h4>
          <p>Tu código de referencia es:</p>
          <div class="sc-ref-code">${refCode}</div>
          <p>Te enviamos una copia a tu correo.</p>
          <button class="sc-btn sc-btn-outline" style="margin-top:12px" id="sc-btn-new">Crear otro ticket</button>
        </div>
      `;
    }
    return `
      <form id="sc-create-form" novalidate>
        <div class="sc-form-group">
          <label class="sc-label">Correo electrónico *</label>
          <input class="sc-input" type="email" id="sc-email" placeholder="tu@correo.com" />
          <span class="sc-error" id="sc-err-email"></span>
        </div>
        <div class="sc-form-group">
          <label class="sc-label">Asunto *</label>
          <input class="sc-input" type="text" id="sc-subject" placeholder="Describe brevemente el problema" />
          <span class="sc-error" id="sc-err-subject"></span>
        </div>
        <div class="sc-form-group">
          <label class="sc-label">Descripción</label>
          <textarea class="sc-textarea" id="sc-desc" placeholder="Detalla tu solicitud..."></textarea>
        </div>
        <div class="sc-row">
          <div class="sc-form-group">
            <label class="sc-label">Tipo *</label>
            <select class="sc-select" id="sc-type">
              <option value="P">Petición</option>
              <option value="Q">Queja</option>
              <option value="R">Reclamo</option>
              <option value="S">Sugerencia</option>
            </select>
          </div>
          <div class="sc-form-group">
            <label class="sc-label">Prioridad</label>
            <select class="sc-select" id="sc-priority">
              <option value="LOW">Baja</option>
              <option value="MEDIUM" selected>Media</option>
              <option value="HIGH">Alta</option>
              <option value="URGENT">Urgente</option>
            </select>
          </div>
        </div>
        <button type="submit" class="sc-btn sc-btn-primary">Enviar solicitud</button>
      </form>
    `;
  }

  function bindCreate() {
    const form = document.getElementById("sc-create-form");
    if (!form) {
      document.getElementById("sc-btn-new")?.addEventListener("click", () => {
        submitted = false; refCode = null; renderPanel();
      });
      return;
    }
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email   = document.getElementById("sc-email").value.trim();
      const subject = document.getElementById("sc-subject").value.trim();
      let valid = true;

      document.getElementById("sc-err-email").textContent = "";
      document.getElementById("sc-err-subject").textContent = "";

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.getElementById("sc-err-email").textContent = "Ingresa un correo válido.";
        valid = false;
      }
      if (!subject) {
        document.getElementById("sc-err-subject").textContent = "El asunto es requerido.";
        valid = false;
      }
      if (!valid) return;

      refCode = "SUP-" + Date.now().toString().slice(-6);
      submitted = true;
      renderPanel();
    });
  }

  /* ── Tab: Consultar estado ───────────────────────────────────────────────── */
  function renderTrackTab() {
    return `
      <div>
        <p style="font-size:12px;color:#64748b;margin-bottom:10px">Ingresa tu código de referencia para ver el estado de tu ticket.</p>
        <div style="display:flex;gap:6px;margin-bottom:8px">
          <input class="sc-input" type="text" id="sc-ref" placeholder="SUP-2024-001" style="flex:1" />
          <button class="sc-btn sc-btn-primary" style="width:auto;padding:8px 12px" id="sc-search">Buscar</button>
        </div>
        <div id="sc-track-result"></div>
      </div>
    `;
  }

  function bindTrack() {
    const btn = document.getElementById("sc-search");
    if (!btn) return;
    const search = () => {
      const code = document.getElementById("sc-ref").value.trim().toUpperCase();
      const ticket = MOCK_TICKETS.find(t => t.referenceCode === code);
      const el = document.getElementById("sc-track-result");
      if (!ticket) {
        el.innerHTML = `<p style="font-size:12px;color:#ef4444;text-align:center;margin-top:8px">Ticket no encontrado.</p>`;
        return;
      }
      const statusLabel = { OPEN:"Abierto", IN_PROGRESS:"En progreso", RESOLVED:"Resuelto", CLOSED:"Cerrado", REOPENED:"Reabierto" };
      const typeLabel   = { P:"Petición", Q:"Queja", R:"Reclamo", S:"Sugerencia" };
      el.innerHTML = `
        <div class="sc-track-result">
          <h4>${ticket.subject}</h4>
          <div class="sc-info-row"><span class="sc-info-label">Código</span><code style="font-size:11px;color:#6366f1">${ticket.referenceCode}</code></div>
          <div class="sc-info-row"><span class="sc-info-label">Tipo</span><span>${typeLabel[ticket.type]}</span></div>
          <div class="sc-info-row"><span class="sc-info-label">Estado</span><span class="sc-badge sc-badge-${ticket.status.toLowerCase()}">${statusLabel[ticket.status]}</span></div>
          <div class="sc-info-row"><span class="sc-info-label">Actualizado</span><span>${ticket.updatedAt}</span></div>
        </div>
        <p style="font-size:11px;color:#94a3b8;margin-top:8px;text-align:center">Para ver el detalle completo usa la <a href="#/track" style="color:#6366f1">página de consulta pública</a>.</p>
      `;
    };
    btn.addEventListener("click", search);
    document.getElementById("sc-ref").addEventListener("keydown", e => { if (e.key === "Enter") search(); });
  }

  /* ── Tab: Base de conocimiento ───────────────────────────────────────────── */
  function renderKB() {
    return `
      <div>
        <input class="sc-input" type="text" id="sc-kb-search" placeholder="Buscar artículo..." style="margin-bottom:10px" />
        <div id="sc-kb-list">
          ${MOCK_ARTICLES.map((a, i) => `
            <div class="sc-article" data-index="${i}">
              <h4>${a.title}</h4>
              <p>${a.summary}</p>
              <div class="sc-article-detail">${a.body}</div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  function bindKB() {
    const list = document.getElementById("sc-kb-list");
    if (!list) return;

    list.querySelectorAll(".sc-article").forEach(el => {
      el.addEventListener("click", () => el.classList.toggle("open"));
    });

    document.getElementById("sc-kb-search")?.addEventListener("input", function () {
      const q = this.value.toLowerCase();
      list.querySelectorAll(".sc-article").forEach((el, i) => {
        const a = MOCK_ARTICLES[i];
        el.style.display = (a.title + a.summary + a.body).toLowerCase().includes(q) ? "" : "none";
      });
    });
  }

})();
