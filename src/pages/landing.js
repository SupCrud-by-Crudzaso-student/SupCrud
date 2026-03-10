import { mockTickets, saveData } from "../mocks/data.js";

export function renderLanding(container) {
  let submitted = false;
  let refCode = "";

  function render() {
    container.innerHTML = `
    <div class="landing">

      <!-- NAV -->
      <nav class="landing-nav">
        <div class="landing-logo">
          SupCrud
          <span>by Crudzaso</span>
        </div>
        <div class="landing-nav-links">
          <a href="#submit">Enviar ticket</a>
          <a href="#/track">Consultar ticket</a>
          <a href="#features">Funcionalidades</a>
          <a href="#types">Tipos</a>
          <button class="btn btn-primary btn-sm" onclick="navigate('/login')">Iniciar sesión</button>
        </div>
      </nav>

      <!-- HERO -->
      <section class="hero">
        <div class="hero-content">
          <div class="hero-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            Plataforma PQRS SaaS
          </div>
          <h1>Gestiona tus <span>PQRS</span> de forma inteligente</h1>
          <p>SupCrud by Crudzaso te permite integrar un sistema completo de soporte en tu negocio mediante un widget embebible, con IA, adjuntos y más.</p>
          <div class="hero-actions">
            <button class="btn btn-primary btn-lg" onclick="navigate('/login')">Comenzar ahora</button>
            <button class="btn btn-hero-outline btn-lg" onclick="document.getElementById('submit').scrollIntoView({behavior:'smooth'})">Enviar mi PQRS</button>
            <button class="btn btn-hero-outline btn-lg" onclick="navigate('/track')">Consultar mi ticket</button>
          </div>
        </div>
      </section>

      <!-- FEATURES -->
      <section class="section" id="features">
        <div class="section-header">
          <h2>Todo lo que necesitas para tu soporte</h2>
          <p>Un ecosistema completo de herramientas para gestionar la comunicación con tus clientes.</p>
        </div>
        <div class="features-grid">
          ${[
            { icon: ticketIcon(), title: "Gestión de tickets", desc: "Crea, asigna y resuelve tickets con estados detallados y trazabilidad completa." },
            { icon: workspaceIcon(), title: "Multi-workspace", desc: "Administra múltiples negocios bajo una sola cuenta con separación estricta de datos." },
            { icon: aiIcon(), title: "IA integrada", desc: "Clasificación automática, sugerencia de prioridad y asignación inteligente con OpenAI." },
            { icon: widgetIcon(), title: "Widget embebible", desc: "Integra el sistema de soporte en tu web con una sola línea de código." },
            { icon: otpIcon(), title: "Consulta pública + OTP", desc: "Tus clientes pueden rastrear sus tickets con verificación segura por correo." },
            { icon: addonIcon(), title: "Add-ons flexibles", desc: "Activa adjuntos, IA o base de conocimiento según las necesidades de tu negocio." },
          ].map(f => `
            <div class="feature-card">
              <div class="feature-icon">${f.icon}</div>
              <h3>${f.title}</h3>
              <p>${f.desc}</p>
            </div>
          `).join("")}
        </div>
      </section>

      <!-- TIPOS PQRS -->
      <section class="section" id="types" style="background:#f1f5f9">
        <div class="section-header">
          <h2>Los 4 tipos de PQRS</h2>
          <p>Clasifica cada solicitud de tu cliente para darle la atención correcta.</p>
        </div>
        <div class="types-grid">
          <div class="type-card" style="background:#e0e7ff">
            <div class="type-letter" style="color:#4338ca">P</div>
            <h3 style="color:#4338ca">Petición</h3>
            <p style="color:#6366f1">Solicitudes de información, servicios o acciones.</p>
          </div>
          <div class="type-card" style="background:#fce7f3">
            <div class="type-letter" style="color:#9d174d">Q</div>
            <h3 style="color:#9d174d">Queja</h3>
            <p style="color:#be185d">Manifestaciones de inconformidad con el servicio.</p>
          </div>
          <div class="type-card" style="background:#ffedd5">
            <div class="type-letter" style="color:#9a3412">R</div>
            <h3 style="color:#9a3412">Reclamo</h3>
            <p style="color:#c2410c">Exigencia de corrección de errores o daños.</p>
          </div>
          <div class="type-card" style="background:#f0fdf4">
            <div class="type-letter" style="color:#166534">S</div>
            <h3 style="color:#166534">Sugerencia</h3>
            <p style="color:#15803d">Ideas para mejorar productos o servicios.</p>
          </div>
        </div>
      </section>

      <!-- ENVIAR TICKET -->
      <section class="section" id="submit">
        <div class="section-header">
          <h2>Envía tu PQRS</h2>
          <p>Completa el formulario y recibirás un código de seguimiento para tu solicitud.</p>
        </div>
        <div style="max-width:560px;margin:0 auto">
          ${submitted ? `
            <div class="card" style="text-align:center;padding:2.5rem">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2" style="margin:0 auto 1rem"><polyline points="20 6 9 17 4 12"/></svg>
              <h3 style="color:#16a34a;margin-bottom:.5rem">¡Ticket enviado exitosamente!</h3>
              <p class="text-muted" style="font-size:.9rem;margin-bottom:1.2rem">Guarda tu código de referencia para hacer seguimiento.</p>
              <div style="background:#f1f5f9;border-radius:.5rem;padding:1rem;font-size:1.1rem;font-weight:700;color:#6366f1;letter-spacing:.05em">${refCode}</div>
              <button class="btn btn-outline btn-sm" style="margin-top:1.2rem" id="btn-new-submit">Enviar otro ticket</button>
            </div>
          ` : `
            <div class="card">
              <form id="public-ticket-form">
                <div class="auth-form" style="gap:.9rem">
                  <div class="form-group">
                    <label class="form-label">Tu nombre</label>
                    <input class="form-control" type="text" id="pt-name" placeholder="Nombre completo" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Correo electrónico</label>
                    <input class="form-control" type="email" id="pt-email" placeholder="tu@correo.com" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Asunto</label>
                    <input class="form-control" type="text" id="pt-subject" placeholder="Describe brevemente tu solicitud" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Descripción</label>
                    <textarea class="form-control" id="pt-desc" rows="4" placeholder="Detalla tu situación con la mayor información posible..." required></textarea>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Tipo de solicitud</label>
                    <select class="form-control form-select" id="pt-type">
                      <option value="P">Petición — Solicitud de información o servicio</option>
                      <option value="Q">Queja — Inconformidad con el servicio</option>
                      <option value="R">Reclamo — Exigencia de corrección</option>
                      <option value="S">Sugerencia — Idea de mejora</option>
                    </select>
                  </div>
                  <button type="submit" class="btn btn-primary" style="width:100%">Enviar solicitud</button>
                </div>
              </form>
            </div>
          `}
        </div>
      </section>

      <!-- CTA -->
      <section class="cta-section">
        <h2>Empieza a gestionar tu soporte hoy</h2>
        <p>Configura tu workspace en minutos e integra el widget en tu sitio web.</p>
        <button class="btn btn-primary btn-lg" onclick="navigate('/login')">Crear cuenta gratis</button>
      </section>

      <!-- FOOTER -->
      <footer class="landing-footer">
        <p>© 2024 <strong>SupCrud by Crudzaso</strong> — Todos los derechos reservados.</p>
      </footer>

    </div>
  `;

    document.getElementById("public-ticket-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const now = new Date().toISOString();
      const code = "SUP-" + Date.now();
      const ticket = {
        id: "t" + Date.now(),
        referenceCode: code,
        workspaceId: "ws1",
        email: document.getElementById("pt-email").value,
        subject: document.getElementById("pt-subject").value,
        description: document.getElementById("pt-desc").value,
        type: document.getElementById("pt-type").value,
        priority: "MEDIUM",
        status: "OPEN",
        tags: [], category: "",
        createdAt: now, updatedAt: now,
      };
      mockTickets.unshift(ticket);
      saveData();
      submitted = true;
      refCode = code;
      render();
      document.getElementById("submit")?.scrollIntoView({ behavior: "smooth" });
    });

    document.getElementById("btn-new-submit")?.addEventListener("click", () => {
      submitted = false;
      refCode = "";
      render();
      document.getElementById("submit")?.scrollIntoView({ behavior: "smooth" });
    });
  }

  render();
}

// ─── Íconos SVG ──────────────────────────────────────────────────────────────
function ticketIcon() {
  return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg>`;
}
function workspaceIcon() {
  return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8m-4-4v4"/></svg>`;
}
function aiIcon() {
  return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z"/><path d="M12 8v4l3 3"/></svg>`;
}
function widgetIcon() {
  return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`;
}
function otpIcon() {
  return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`;
}
function addonIcon() {
  return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
}
