// Simple reactive store sin dependencias externas

const state = {
  user: null,            // usuario autenticado
  role: null,            // 'OWNER' | 'ADMIN' | 'AGENT'
  activeWorkspace: null, // workspace seleccionado
  workspaces: [],        // workspaces del usuario
};

const listeners = new Set();

function getState() {
  return { ...state };
}

function setState(partial) {
  Object.assign(state, partial);
  listeners.forEach(fn => fn({ ...state }));
}

function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// Persistencia en localStorage
function loadFromStorage() {
  try {
    const saved = localStorage.getItem("supcrud-session");
    if (saved) {
      const parsed = JSON.parse(saved);
      Object.assign(state, parsed);
    }
  } catch { /* ignore */ }
}

function saveToStorage() {
  localStorage.setItem("supcrud-session", JSON.stringify({
    user: state.user,
    role: state.role,
    activeWorkspace: state.activeWorkspace,
    workspaces: state.workspaces,
  }));
}

subscribe(saveToStorage);
loadFromStorage();

export { getState, setState, subscribe };
