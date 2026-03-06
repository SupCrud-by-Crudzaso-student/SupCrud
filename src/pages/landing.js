export function renderLanding(container) {
  container.innerHTML = `
    <div class="landing">

      <!-- NAV -->
      <nav class="landing-nav">
        <div class="landing-logo">
          SupCrud
          <span>by Crudzaso</span>
        </div>
        <div class="landing-nav-links">
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
