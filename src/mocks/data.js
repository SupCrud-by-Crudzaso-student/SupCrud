const STORAGE_KEY = "supcrud-data";

// ─── Datos por defecto ─────────────────────────────────────────────────────────

const _defaultAuthUsers = [
  { id: "owner1", name: "Dev Crudzaso", email: "dev@crudzaso.com", password: "admin123", role: "OWNER", workspaces: [] },
  { id: "u1", name: "Carlos Perez",  email: "carlos@empresa.com", password: "admin123", role: "ADMIN", workspaces: ["ws1", "ws2"] },
  { id: "u2", name: "Maria Lopez",   email: "maria@empresa.com",  password: "agent123", role: "AGENT", workspaces: ["ws1"] },
];

const _defaultWorkspaces = [
  { id: "ws1", workspaceKey: "empresa-alpha",   name: "Empresa Alpha",   status: "ACTIVE",    createdAt: "2024-01-10", addons: ["ATTACHMENTS", "AI_ASSIST"] },
  { id: "ws2", workspaceKey: "tienda-beta",      name: "Tienda Beta",     status: "ACTIVE",    createdAt: "2024-02-15", addons: ["ATTACHMENTS"] },
  { id: "ws3", workspaceKey: "servicios-gamma",  name: "Servicios Gamma", status: "SUSPENDED", createdAt: "2024-03-01", addons: [] },
];

const _defaultMembers = [
  { id: "m1", userId: "u1", name: "Carlos Perez", email: "carlos@empresa.com", role: "ADMIN", workspaceId: "ws1" },
  { id: "m2", userId: "u2", name: "Maria Lopez",  email: "maria@empresa.com",  role: "AGENT", workspaceId: "ws1" },
  { id: "m3", userId: "u3", name: "Juan Garcia",  email: "juan@empresa.com",   role: "AGENT", workspaceId: "ws1" },
];

const _defaultTickets = [
  {
    id: "t1", referenceCode: "SUP-2024-001", workspaceId: "ws1",
    subject: "No puedo iniciar sesion en mi cuenta",
    description: "Desde ayer me aparece error 403 al intentar ingresar.",
    type: "Q", status: "OPEN", priority: "HIGH",
    email: "cliente1@gmail.com", assignedAgentId: "u2", assignedAgent: "Maria Lopez",
    tags: ["acceso", "login"], category: "Autenticacion",
    createdAt: "2024-11-01T10:30:00Z", updatedAt: "2024-11-01T10:30:00Z",
  },
  {
    id: "t2", referenceCode: "SUP-2024-002", workspaceId: "ws1",
    subject: "Solicito factura electronica de mi compra",
    description: "Realice compra el 28 de octubre y no recibi factura.",
    type: "P", status: "IN_PROGRESS", priority: "MEDIUM",
    email: "cliente2@hotmail.com", assignedAgentId: "u3", assignedAgent: "Juan Garcia",
    tags: ["facturacion"], category: "Administrativo",
    createdAt: "2024-10-29T14:00:00Z", updatedAt: "2024-11-01T09:00:00Z",
  },
  {
    id: "t3", referenceCode: "SUP-2024-003", workspaceId: "ws1",
    subject: "El producto llego danado",
    description: "La caja llego completamente aplastada y el producto roto.",
    type: "R", status: "RESOLVED", priority: "URGENT",
    email: "cliente3@yahoo.com", tags: ["envio", "dano"], category: "Logistica",
    createdAt: "2024-10-25T08:00:00Z", updatedAt: "2024-10-30T16:00:00Z",
  },
  {
    id: "t4", referenceCode: "SUP-2024-004", workspaceId: "ws1",
    subject: "Sugiero agregar metodo de pago PSE",
    description: "Seria muy util poder pagar con PSE directamente.",
    type: "S", status: "OPEN", priority: "LOW",
    email: "cliente4@gmail.com", tags: ["pagos", "mejora"], category: "Producto",
    createdAt: "2024-10-20T12:00:00Z", updatedAt: "2024-10-20T12:00:00Z",
  },
  {
    id: "t5", referenceCode: "SUP-2024-005", workspaceId: "ws1",
    subject: "Cobro duplicado en mi tarjeta",
    description: "Se me debito dos veces el mismo pago.",
    type: "Q", status: "CLOSED", priority: "URGENT",
    email: "cliente5@gmail.com", assignedAgentId: "u2", assignedAgent: "Maria Lopez",
    tags: ["cobro", "tarjeta"], category: "Pagos",
    createdAt: "2024-10-10T09:00:00Z", updatedAt: "2024-10-15T11:00:00Z",
  },
];

const _defaultMessages = {
  t1: [
    { id: "msg1", content: "Hola, estoy teniendo problemas para iniciar sesion desde ayer.", authorEmail: "cliente1@gmail.com", authorName: "Cliente", isAgent: false, createdAt: "2024-11-01T10:30:00Z" },
    { id: "msg2", content: "Hola, entendemos tu situacion. Por favor intenta restablecer tu contrasena desde el enlace de recuperacion.", authorEmail: "maria@empresa.com", authorName: "Maria Lopez", isAgent: true, createdAt: "2024-11-01T11:00:00Z" },
  ],
};

const _defaultEvents = {
  t1: [
    { id: "e1", type: "CREATED",  description: "Ticket creado", createdAt: "2024-11-01T10:30:00Z" },
    { id: "e2", type: "ASSIGNED", description: "Asignado a Maria Lopez", performedBy: "Carlos Perez", createdAt: "2024-11-01T10:45:00Z" },
  ],
};

// ─── Colecciones mutables exportadas ──────────────────────────────────────────

export const mockAuthUsers  = [];
export const mockUsers      = [];
export const mockWorkspaces = [];
export const mockMembers    = [];
export const mockTickets    = [];
export const mockMessages   = {};
export const mockEvents     = {};

// Estáticos (catálogos)
export const mockAddons = [
  { key: "ATTACHMENTS",    name: "Adjuntos",             description: "Permite subir archivos a los tickets via Cloudinary." },
  { key: "AI_ASSIST",      name: "AI Assist",            description: "Clasificacion automatica y asignacion con OpenAI." },
  { key: "KNOWLEDGE_BASE", name: "Base de Conocimiento", description: "Articulos de ayuda visibles en el widget." },
];

export const mockMetrics = [
  { workspaceId: "ws1", workspaceName: "Empresa Alpha",   totalTickets: 5,  openTickets: 2, activeAddons: ["ATTACHMENTS", "AI_ASSIST"] },
  { workspaceId: "ws2", workspaceName: "Tienda Beta",     totalTickets: 12, openTickets: 4, activeAddons: ["ATTACHMENTS"] },
  { workspaceId: "ws3", workspaceName: "Servicios Gamma", totalTickets: 3,  openTickets: 1, activeAddons: [] },
];

// ─── Persistencia ──────────────────────────────────────────────────────────────

export function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      authUsers:  mockAuthUsers,
      workspaces: mockWorkspaces,
      members:    mockMembers,
      tickets:    mockTickets,
      messages:   mockMessages,
      events:     mockEvents,
    }));
  } catch { /* ignore */ }
}

function init() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const d = JSON.parse(raw);
      mockAuthUsers.push(...(d.authUsers  || _defaultAuthUsers));
      mockWorkspaces.push(...(d.workspaces || _defaultWorkspaces));
      mockMembers.push(...(d.members    || _defaultMembers));
      mockTickets.push(...(d.tickets    || _defaultTickets));
      Object.assign(mockMessages, d.messages || _defaultMessages);
      Object.assign(mockEvents,   d.events   || _defaultEvents);
    } else {
      mockAuthUsers.push(..._defaultAuthUsers);
      mockWorkspaces.push(..._defaultWorkspaces);
      mockMembers.push(..._defaultMembers);
      mockTickets.push(..._defaultTickets);
      Object.assign(mockMessages, _defaultMessages);
      Object.assign(mockEvents,   _defaultEvents);
    }
  } catch {
    mockAuthUsers.push(..._defaultAuthUsers);
    mockWorkspaces.push(..._defaultWorkspaces);
    mockMembers.push(..._defaultMembers);
    mockTickets.push(..._defaultTickets);
    Object.assign(mockMessages, _defaultMessages);
    Object.assign(mockEvents,   _defaultEvents);
  }

  // mockUsers derivado de mockAuthUsers (sin contraseñas)
  mockAuthUsers.forEach(u => {
    mockUsers.push({ id: u.id, name: u.name, email: u.email });
  });
}

init();
