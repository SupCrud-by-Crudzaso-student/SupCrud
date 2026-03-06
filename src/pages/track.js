import { mockTickets } from "../mocks/data.js";
import { statusBadge, typeBadge, priorityBadge, formatDate, formatDateTime } from "../components/helpers.js";
import { mockMessages, mockEvents } from "../mocks/data.js";
import { toast } from "../components/toast.js";

export function renderTrack(container) {
  let foundTicket = null;
  let otpSent = false;
  let otpVerified = false;
  const MOCK_OTP = "123456";

  function render() {
    container.innerHTML = `
      <div class="track-page">
        <div class="track-header">
          <h1>SupCrud by Crudzaso</h1>
          <span style="font-size:.82rem;opacity:.8">Consulta pública de tickets</span>
        </div>
        <div class="track-body">
          <div class="track-card">

            <!-- Buscador -->
            <div class="card">
              <div class="card-header"><span class="card-title">Consultar mi ticket</span></div>
              <p class="text-muted" style="font-size:.88rem;margin-bottom:1rem">
                Ingresa tu código de referencia para ver el estado de tu solicitud.
              </p>
              <div style="display:flex;gap:.6rem">
                <input class="form-control" type="text" id="ref-input" placeholder="Ej: SUP-2024-001" style="flex:1" />
                <button class="btn btn-primary" id="btn-search">Buscar</button>
              </div>
              <p style="font-size:.76rem;color:#94a3b8;margin-top:.5rem">
                Tickets de prueba: SUP-2024-001, SUP-2024-002, SUP-2024-003
              </p>
            </div>

            <!-- Resultado -->
            <div id="track-result" class="track-result"></div>
          </div>
        </div>
      </div>
    `;

    document.getElementById("btn-search").addEventListener("click", () => {
      const code = document.getElementById("ref-input").value.trim().toUpperCase();
      foundTicket = mockTickets.find(t => t.referenceCode === code);
      otpSent = false;
      otpVerified = false;
      renderResult();
    });

    document.getElementById("ref-input").addEventListener("keydown", (e) => {
      if (e.key === "Enter") document.getElementById("btn-search").click();
    });
  }

  function renderResult() {
    const el = document.getElementById("track-result");
    if (!el) return;

    if (!foundTicket) {
      el.innerHTML = `
        <div class="card" style="margin-top:1rem;text-align:center;padding:2rem">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" style="margin:0 auto .8rem"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          <h3 style="color:#ef4444">Ticket no encontrado</h3>
          <p class="text-muted" style="font-size:.88rem">Verifica el código e intenta de nuevo.</p>
        </div>
      `;
      return;
    }

    el.innerHTML = `
      <div class="card" style="margin-top:1rem">
        <div class="card-header">
          <span class="card-title">${foundTicket.referenceCode}</span>
          ${statusBadge(foundTicket.status)}
        </div>
        <h3 style="font-size:1rem;margin-bottom:1rem">${foundTicket.subject}</h3>
        <div>
          <div class="info-row"><span class="label">Tipo</span>${typeBadge(foundTicket.type)}</div>
          <div class="info-row"><span class="label">Estado</span>${statusBadge(foundTicket.status)}</div>
          <div class="info-row"><span class="label">Prioridad</span>${priorityBadge(foundTicket.priority)}</div>
          <div class="info-row"><span class="label">Creado</span>${formatDate(foundTicket.createdAt)}</div>
          <div class="info-row"><span class="label">Última actualización</span>${formatDate(foundTicket.updatedAt)}</div>
        </div>

        ${!otpVerified ? `
          <div style="margin-top:1.5rem;padding-top:1.2rem;border-top:1px solid var(--border)">
            <p style="font-size:.88rem;font-weight:600;margin-bottom:.4rem">Ver detalle completo</p>
            <p class="text-muted" style="font-size:.83rem;margin-bottom:.8rem">Verifica tu identidad con un código OTP enviado a tu correo.</p>

            ${!otpSent ? `
              <button class="btn btn-secondary btn-sm" id="btn-send-otp">Solicitar OTP por correo</button>
            ` : `
              <p style="font-size:.83rem;color:#16a34a;margin-bottom:.8rem">
                ✓ OTP enviado a ${foundTicket.email} (usa <strong>${MOCK_OTP}</strong> en demo)
              </p>
              <div class="otp-inputs" id="otp-inputs">
                ${[0,1,2,3,4,5].map(i => `<input class="otp-input" maxlength="1" type="text" data-index="${i}" />`).join("")}
              </div>
              <button class="btn btn-primary btn-sm" id="btn-verify-otp">Verificar OTP</button>
            `}
          </div>
        ` : `
          <!-- Detalle completo con OTP verificado -->
          <div style="margin-top:1.5rem;padding-top:1.2rem;border-top:1px solid var(--border)">
            <div style="display:flex;align-items:center;gap:.4rem;margin-bottom:1rem;color:#16a34a;font-weight:600;font-size:.88rem">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Identidad verificada — Vista completa
            </div>

            <p style="font-size:.85rem;font-weight:600;margin-bottom:.6rem">Descripción</p>
            <p style="font-size:.85rem;color:#475569;margin-bottom:1.2rem">${foundTicket.description}</p>

            ${foundTicket.assignedAgent ? `
              <p style="font-size:.85rem;font-weight:600;margin-bottom:.4rem">Agente asignado</p>
              <p style="font-size:.85rem;color:#475569;margin-bottom:1.2rem">${foundTicket.assignedAgent}</p>
            ` : ""}

            <p style="font-size:.85rem;font-weight:600;margin-bottom:.6rem">Conversación</p>
            <div style="display:flex;flex-direction:column;gap:.6rem">
              ${(mockMessages[foundTicket.id] || []).map(m => `
                <div style="display:flex;flex-direction:column;align-items:${m.isAgent ? "flex-end" : "flex-start"}">
                  <div class="message-bubble ${m.isAgent ? "agent" : "user"}">${m.content}</div>
                  <div class="message-meta">${m.authorName || m.authorEmail} · ${formatDateTime(m.createdAt)}</div>
                </div>
              `).join("") || `<p class="text-muted" style="font-size:.85rem">Sin mensajes.</p>`}
            </div>

            <p style="font-size:.85rem;font-weight:600;margin:.8rem 0 .5rem">Historial</p>
            <div style="display:flex;flex-direction:column;gap:.4rem">
              ${(mockEvents[foundTicket.id] || []).map(ev => `
                <div style="font-size:.82rem;color:#64748b">• <strong>${ev.type}</strong> — ${ev.description} <span style="font-size:.75rem">(${formatDateTime(ev.createdAt)})</span></div>
              `).join("") || `<p class="text-muted" style="font-size:.85rem">Sin eventos.</p>`}
            </div>
          </div>
        `}
      </div>
    `;

    document.getElementById("btn-send-otp")?.addEventListener("click", () => {
      otpSent = true;
      renderResult();
      setTimeout(() => {
        const inputs = document.querySelectorAll(".otp-input");
        inputs.forEach((inp, i) => {
          inp.addEventListener("input", () => {
            if (inp.value.length === 1 && i < inputs.length - 1) inputs[i + 1].focus();
          });
          inp.addEventListener("keydown", (e) => {
            if (e.key === "Backspace" && !inp.value && i > 0) inputs[i - 1].focus();
          });
        });
        inputs[0]?.focus();
      }, 50);
    });

    document.getElementById("btn-verify-otp")?.addEventListener("click", () => {
      const code = [...document.querySelectorAll(".otp-input")].map(i => i.value).join("");
      if (code === MOCK_OTP) {
        otpVerified = true;
        renderResult();
        toast.success("Identidad verificada correctamente");
      } else {
        toast.error("OTP incorrecto. Intenta de nuevo.");
      }
    });
  }

  render();
}
