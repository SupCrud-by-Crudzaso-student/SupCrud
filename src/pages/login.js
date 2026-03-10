import { setState, getState } from "../store/store.js";
import { mockAuthUsers, mockWorkspaces, saveData } from "../mocks/data.js";
import { toast } from "../components/toast.js";
import { navigate } from "../router/router.js";

export function renderLogin(container) {
  const { user } = getState();
  if (user) { redirectAuthed(); return; }

  const isRegister = window.location.hash === "#/register";

  container.innerHTML = isRegister ? renderRegisterHTML() : renderLoginHTML();

  if (isRegister) {
    document.getElementById("register-form").addEventListener("submit", handleRegister);
  } else {
    document.getElementById("login-form").addEventListener("submit", handleLogin);
    document.getElementById("btn-google").addEventListener("click", handleGoogleMock);
  }
}

function renderLoginHTML() {
  return `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-logo">
          <h1>SupCrud</h1>
          <p>by Crudzaso — Inicia sesión en tu cuenta</p>
        </div>

        <form class="auth-form" id="login-form">
          <div class="form-group">
            <label class="form-label">Correo electrónico</label>
            <input class="form-control" type="email" id="login-email" placeholder="correo@empresa.com" required />
          </div>
          <div class="form-group">
            <label class="form-label">Contraseña</label>
            <input class="form-control" type="password" id="login-password" placeholder="••••••••" required />
          </div>
          <span id="login-error" class="form-error hidden"></span>
          <button type="submit" class="btn btn-primary w-full" style="justify-content:center">
            Iniciar sesión
          </button>
        </form>

        <div class="auth-divider" style="margin:1rem 0">o</div>

        <button class="btn btn-google" id="btn-google">
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.16C6.51 42.68 14.62 48 24 48z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.16C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.32 2.56 13.22l7.98 6.16C12.43 13.72 17.74 9.5 24 9.5z"/>
          </svg>
          Continuar con Google
        </button>

        <p class="auth-footer">
          ¿No tienes cuenta?
          <a href="#" onclick="navigate('/register')">Regístrate</a>
        </p>
        <p class="auth-footer" style="margin-top:.3rem">
          <a href="#" onclick="navigate('/')">← Volver al inicio</a>
        </p>

        <div style="margin-top:1.5rem;padding:1rem;background:#f8fafc;border-radius:8px;font-size:.78rem;color:#64748b">
          <strong>Cuentas de prueba:</strong><br/>
          Owner: dev@crudzaso.com / admin123<br/>
          Admin: carlos@empresa.com / admin123<br/>
          Agent: maria@empresa.com / agent123
        </div>
      </div>
    </div>
  `;
}

function renderRegisterHTML() {
  return `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-logo">
          <h1>SupCrud</h1>
          <p>by Crudzaso — Crea tu cuenta gratis</p>
        </div>

        <form class="auth-form" id="register-form">
          <div class="form-group">
            <label class="form-label">Nombre completo</label>
            <input class="form-control" type="text" id="reg-name" placeholder="Tu nombre" required />
          </div>
          <div class="form-group">
            <label class="form-label">Correo electrónico</label>
            <input class="form-control" type="email" id="reg-email" placeholder="correo@empresa.com" required />
          </div>
          <div class="form-group">
            <label class="form-label">Nombre del workspace</label>
            <input class="form-control" type="text" id="reg-workspace" placeholder="Mi Empresa" required />
          </div>
          <div class="form-group">
            <label class="form-label">Contraseña</label>
            <input class="form-control" type="password" id="reg-password" placeholder="Mínimo 6 caracteres" required minlength="6" />
          </div>
          <div class="form-group">
            <label class="form-label">Confirmar contraseña</label>
            <input class="form-control" type="password" id="reg-password2" placeholder="Repite tu contraseña" required />
          </div>
          <span id="reg-error" class="form-error hidden"></span>
          <button type="submit" class="btn btn-primary w-full" style="justify-content:center">
            Crear cuenta
          </button>
        </form>

        <p class="auth-footer" style="margin-top:1rem">
          ¿Ya tienes cuenta?
          <a href="#" onclick="navigate('/login')">Inicia sesión</a>
        </p>
        <p class="auth-footer" style="margin-top:.3rem">
          <a href="#" onclick="navigate('/')">← Volver al inicio</a>
        </p>
      </div>
    </div>
  `;
}

function handleRegister(e) {
  e.preventDefault();
  const name      = document.getElementById("reg-name").value.trim();
  const email     = document.getElementById("reg-email").value.trim().toLowerCase();
  const wsName    = document.getElementById("reg-workspace").value.trim();
  const password  = document.getElementById("reg-password").value;
  const password2 = document.getElementById("reg-password2").value;
  const errorEl   = document.getElementById("reg-error");

  const showError = (msg) => {
    errorEl.textContent = msg;
    errorEl.classList.remove("hidden");
  };

  if (password !== password2) { showError("Las contraseñas no coinciden."); return; }
  if (mockAuthUsers.find(u => u.email === email)) { showError("Ya existe una cuenta con ese correo."); return; }

  errorEl.classList.add("hidden");

  // Crear nuevo workspace
  const wsKey = wsName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const newWorkspace = {
    id: "ws" + Date.now(),
    workspaceKey: wsKey + "-" + Date.now().toString().slice(-4),
    name: wsName,
    status: "ACTIVE",
    createdAt: new Date().toISOString().split("T")[0],
    addons: [],
  };
  mockWorkspaces.push(newWorkspace);

  // Crear nuevo usuario
  const newUser = {
    id: "u" + Date.now(),
    name,
    email,
    password,
    role: "ADMIN",
    workspaces: [newWorkspace.id],
  };
  mockAuthUsers.push(newUser);
  saveData();

  toast.success(`¡Cuenta creada! Bienvenido, ${name}`);
  loginUser(newUser);
}

function handleLogin(e) {
  e.preventDefault();
  const email    = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;
  const errorEl  = document.getElementById("login-error");

  const found = mockAuthUsers.find(u => u.email === email && u.password === password);

  if (!found) {
    errorEl.textContent = "Correo o contraseña incorrectos.";
    errorEl.classList.remove("hidden");
    return;
  }

  errorEl.classList.add("hidden");
  loginUser(found);
}

function handleGoogleMock() {
  // Simula login con Google como ADMIN
  const user = mockAuthUsers[1];
  toast.info("Simulando login con Google...");
  setTimeout(() => loginUser(user), 800);
}

function loginUser(user) {
  const userWorkspaces = mockWorkspaces.filter(ws => user.workspaces?.includes(ws.id));

  setState({ user: { id: user.id, name: user.name, email: user.email }, role: user.role, workspaces: userWorkspaces });

  toast.success(`Bienvenido, ${user.name}`);

  if (user.role === "OWNER") {
    navigate("/owner");
    return;
  }

  if (userWorkspaces.length === 1) {
    setState({ activeWorkspace: userWorkspaces[0] });
    navigate(`/workspace/${userWorkspaces[0].workspaceKey}`);
  } else if (userWorkspaces.length > 1) {
    navigate("/select-workspace");
  } else {
    toast.error("No tienes workspaces asignados.");
  }
}

function redirectAuthed() {
  const { role, activeWorkspace } = getState();
  if (role === "OWNER") { navigate("/owner"); return; }
  if (activeWorkspace) { navigate(`/workspace/${activeWorkspace.workspaceKey}`); return; }
  navigate("/select-workspace");
}
