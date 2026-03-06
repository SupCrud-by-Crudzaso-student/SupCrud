// Router basado en hash (#/ruta)

const routes = {};
let currentRoute = null;

function register(path, handler) {
  routes[path] = handler;
}

function navigate(path, params = {}) {
  window.location.hash = path;
  currentRoute = path;
  render(path, params);
}

function render(path, params = {}) {
  const app = document.getElementById("app");
  if (!app) return;

  // Buscar ruta exacta primero
  if (routes[path]) {
    app.innerHTML = "";
    routes[path](app, params);
    return;
  }

  // Buscar rutas con parámetros dinámicos (ej: /workspace/:key)
  for (const [pattern, handler] of Object.entries(routes)) {
    const match = matchRoute(pattern, path);
    if (match) {
      app.innerHTML = "";
      handler(app, { ...params, ...match });
      return;
    }
  }

  // 404
  app.innerHTML = `<div style="text-align:center;padding:4rem">
    <h2>Página no encontrada</h2>
    <p style="color:#64748b;margin:.5rem 0 1.5rem">La ruta <strong>${path}</strong> no existe.</p>
    <button class="btn btn-primary" onclick="navigate('/')">Volver al inicio</button>
  </div>`;
}

function matchRoute(pattern, path) {
  const patternParts = pattern.split("/");
  const pathParts = path.split("/");
  if (patternParts.length !== pathParts.length) return null;

  const params = {};
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(":")) {
      params[patternParts[i].slice(1)] = pathParts[i];
    } else if (patternParts[i] !== pathParts[i]) {
      return null;
    }
  }
  return params;
}

function start() {
  window.addEventListener("hashchange", () => {
    const hash = window.location.hash.slice(1) || "/";
    render(hash);
  });

  const initial = window.location.hash.slice(1) || "/";
  render(initial);
}

// Exponer navigate globalmente para usar en onclick
window.navigate = navigate;

export { register, navigate, start };
